import { NDKEvent, NDKFilter, NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
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

interface VideoItemProps { item: NDKEvent, paused: boolean }
const MemoizedFeedVideoViewer = memo(({ item, paused }: VideoItemProps) => {
    console.log("render: ", item.pubkey)
    return <FeedVideoViewer event={item} paused={paused} />;
}, (prevProps, nextProps) => {
    return prevProps.item.id === nextProps.item.id && prevProps.paused === nextProps.paused;
})

const VideosFeed = ({ navigation }: StackScreenProps<any>) => {

    const { ndk } = useNDKStore()
    const listRef = useRef<FlatList>(null)
    const lastTimestamp = useRef<number>(timeSeconds.without(7))
    const isFetching = useRef<boolean>(false) 
    const { feedSettings, blackList } = useFeedVideosStore()
    const { useTranslate } = useTranslateService()
    const [videos, setVideos] = useState<NDKEvent[]>([])
    const [paused, setPaused] = useState<boolean>(false)
    const [playingIndex, setPlayingIndex] = useState<number>(0) 
    const [downloading, setDownloading] = useState<boolean>(false)
    const [downloadProgress, setDownloadProgress] = useState<number>(0)
    const [filtersVisible, setFiltersVisible] = useState<boolean>(false)
    const memorizedVideos = useMemo(() => videos, [videos])

    useEffect(() => {
        const unsubscribe = navigation.addListener("blur", () => {
            isFetching.current = false
            setPaused(true)
        })
        return unsubscribe
    }, [])

    useEffect(() => {
        setVideos([])
        lastTimestamp.current = timeSeconds.without(7) 
        setTimeout(fetchVideos, 10)
    }, [feedSettings])

    useFocusEffect(() => { setPaused(false) })

    const fetchVideos = async () => {
        if(isFetching.current) return
        isFetching.current = true
        const filter: NDKFilter = {
            since: lastTimestamp.current, "#t": feedSettings.filterTags, kinds: [1, 1063] 
        }
        const subscription = ndk.subscribe(filter, {
            cacheUsage: NDKSubscriptionCacheUsage.PARALLEL
        })

        var founds: number = 0
        subscription.on("event", event => {
            if(founds >= feedSettings.VIDEOS_LIMIT) {
                return subscription.stop()
            }
            if(event.created_at) lastTimestamp.current = event.created_at

            const url = extractVideoUrl(event.content)
            if(url && !videos.find(v => v.id == event.id) && !blackList.has(event.pubkey)) 
            {
                setVideos(prev => [...prev, event])
                founds++
            }
        })
        
        const finish = () => {
            setTimeout(() => isFetching.current = false, 20)
        }

        subscription.on("eose", finish)
        subscription.on("close", finish)
        subscription.start()

        setTimeout(() => {
            if(founds <= 0) pushMessage(useTranslate("feed.videos.notfound"))
            subscription.stop()
        }, 5000)
    }

    const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
        if(viewableItems.length > 0) { 
            setPlayingIndex(viewableItems[0].index)
        }
    }, [])

    const renderItem = useCallback(({ item, index }:{ item: NDKEvent, index: number }) => {
        return <MemoizedFeedVideoViewer item={item} paused={index !== playingIndex || paused} />
    }, [playingIndex, paused])

    const handleDownload = async () => {
        if(videos.length <= 0) return
        const event = videos[playingIndex]
        const url = extractVideoUrl(event.content)
        if(url) {
            await blobService.downloadVideo({ 
                url, 
                setDownloading, 
                setDownloadProgress 
            })
        }
    }

    const EndLoader = () => (
        <View style={{ paddingVertical: 20 }}>
            <ActivityIndicator size={30} color={theme.colors.white} />
        </View>
    )

    return (
        <SafeAreaView style={theme.styles.container}>
            <FlatList ref={listRef} pagingEnabled
                data={memorizedVideos}
                style={{ flex: 1 }}
                renderItem={renderItem}
                keyExtractor={(item: NDKEvent) => item.id}
                showsVerticalScrollIndicator={false}
                viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
                onViewableItemsChanged={onViewableItemsChanged}
                onEndReached={fetchVideos}
                onEndReachedThreshold={.3}
                removeClippedSubviews // risk of bugs, do not use please
                maxToRenderPerBatch={3}
                initialNumToRender={3} 
                windowSize={3}
                snapToAlignment="center"
                decelerationRate="fast"
                ListFooterComponent={<EndLoader />}
            />

            <VideosHeader 
                downloading={downloading} 
                handleDownload={handleDownload}
                handleManageFilters={() => setFiltersVisible(true)}
            />

            {downloading &&
                <View style={styles.downloadProgressContent}>
                    <Ionicons name={"cloud-download"} size={18} color={theme.colors.white} />
                    <Text style={{ fontSize: 16, color: theme.colors.white }}>
                        {downloadProgress.toFixed(0)}%
                    </Text>
                </View>
            }
            <VideosFilters visible={filtersVisible} setVisible={setFiltersVisible} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    downloadProgressContent: { position: "absolute", top: 300, alignItems: "center", 
        minWidth: 100, padding: 5, borderRadius: 10, backgroundColor: theme.colors.blueOpacity },

})

export default VideosFeed
