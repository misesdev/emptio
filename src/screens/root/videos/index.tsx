import { NDKEvent, NDKFilter, NDKKind, NDKSubscription, 
    NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { View, FlatList, SafeAreaView, Text, StyleSheet } from "react-native"
import { extractVideoUrl } from "@src/utils"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useFeedVideosStore } from "@services/zustand/feedVideos"
import { useFocusEffect } from "@react-navigation/native"
import { ActivityIndicator } from "react-native-paper"
import VideosHeader from "./commons/header"
import VideosFilters from "./commons/filters"
import { blobService } from "@services/blob"
import { pushMessage } from "@services/notification"
import { useTranslateService } from "@src/providers/translateProvider"
import FeedVideoViewer from "./viewer"
import useNDKStore from "@services/zustand/ndk"
import theme from "@src/theme"
import { timeSeconds } from "@services/converter"

const VideosFeed = ({ navigation }: StackScreenProps<any>) => {

    const { ndk } = useNDKStore()
    const timeout = useRef<any>()
    const events = useRef(new Set())
    const subscription = useRef<NDKSubscription>()
    const lastTimestamp = useRef<number>(timeSeconds.now())
    const isFetching = useRef<boolean>(false) 
    const { feedSettings, blackList } = useFeedVideosStore()
    const { useTranslate } = useTranslateService()
    const [videos, setVideos] = useState<NDKEvent[]>([])
    const [paused, setPaused] = useState<boolean>(false)
    const [playingIndex, setPlayingIndex] = useState<number>(0) 

    const memorizedVideos = useMemo(() => videos, [videos])

    useEffect(() => {
        loadResetFeed()
        const unsubscribe = navigation.addListener("blur", () => {
            isFetching.current = false
            setPaused(true)
        })
        return unsubscribe
    }, [feedSettings.filterTags])

    const loadResetFeed = () => {
        setVideos([])
        events.current.clear()
        lastTimestamp.current = timeSeconds.now() 
        setTimeout(fetchVideos, 20)
    }

    useFocusEffect(() => { setPaused(false) })

    const fetchVideos = () => {
        if(isFetching.current) return;

        isFetching.current = true

        const filter: NDKFilter = {
            until: lastTimestamp.current, 
            "#t": feedSettings.filterTags,
            kinds: [NDKKind.Text, NDKKind.Media] 
        }

        subscription.current = ndk.subscribe(filter, {
            cacheUsage: NDKSubscriptionCacheUsage.ONLY_RELAY
        })

        var founds: number = 0
        subscription.current.on("event", event => {
            if(!events.current.has(event.id) && !blackList.has(event.pubkey)) 
            { 
                if(event.created_at) lastTimestamp.current = event.created_at
                if(founds >= feedSettings.VIDEOS_LIMIT) return subscription.current?.stop()
                if(extractVideoUrl(event.content)) 
                {
                    setVideos(prev => [...prev, event])
                    events.current.add(event.id)
                    founds ++
                }
            }
        })
        
        const finishFetch = () => {
            clearTimeout(timeout.current)
            setTimeout(() => isFetching.current = false, 20)
            subscription.current?.stop()
            subscription.current?.removeAllListeners()
            subscription.current = undefined
        }
        
        subscription.current.on("eose", finishFetch)
        subscription.current.on("close", finishFetch)

        timeout.current = setTimeout(() => {
            if(founds === 0) pushMessage(useTranslate("feed.videos.notfound"))
            subscription.current?.stop()
        }, 5000)
    }

    const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
        if(viewableItems.length > 0 && viewableItems[0].index != null) {
            setPlayingIndex(viewableItems[0].index)
        }
    }, [])

    const renderItem = useCallback(({ item, index }:{ item: NDKEvent, index: number }) => {
        return <FeedVideoViewer event={item} paused={index !== playingIndex || paused} />
    }, [playingIndex, paused])

    // const handleDownload = async () => {
    //     if(!videos[playingIndex]) return
    //     const event = videos[playingIndex]
    //     const url = extractVideoUrl(event.content)
    //     if(url) {
    //         await blobService.downloadVideo({ 
    //             url, 
    //             setDownloading, 
    //             setDownloadProgress 
    //         })
    //     }
    // }

    const EndLoader = () => (
        <View style={{ paddingVertical: 20 }}>
            <ActivityIndicator size={24} color={theme.colors.white} />
        </View>
    )

    return (
        <SafeAreaView style={theme.styles.container}>
            <FlatList pagingEnabled
                data={memorizedVideos}
                style={{ flex: 1 }}
                renderItem={renderItem}
                keyExtractor={(item: NDKEvent) => item.id}
                showsVerticalScrollIndicator={false}
                viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
                onViewableItemsChanged={onViewableItemsChanged}
                onEndReached={fetchVideos}
                onEndReachedThreshold={.2}
                maxToRenderPerBatch={3}
                initialNumToRender={3}
                windowSize={3}
                snapToAlignment="center"
                decelerationRate="fast"
                legacyImplementation
                ListFooterComponent={<EndLoader />}
                disableVirtualization={false}
                removeClippedSubviews // experimental
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    downloadProgressContent: { position: "absolute", top: 300, alignItems: "center", 
        minWidth: 100, padding: 5, borderRadius: 10, backgroundColor: theme.colors.blueOpacity },

})

export default VideosFeed
