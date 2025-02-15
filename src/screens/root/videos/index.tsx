import { NDKEvent, NDKFilter, NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { memo, useCallback, useEffect, useRef, useState } from "react"
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
import theme from "@src/theme"
import useNDKStore from "@services/zustand/ndk"

const MemoizedFeedVideoViewer = memo(({ item, paused }: { item: NDKEvent, paused: boolean }) => {
    console.log("renderItem:", item.id);
    const url = extractVideoUrl(item.content);
    return <FeedVideoViewer url={url ?? ""} event={item} paused={paused} />;
}, (prevProps, nextProps) => {
    return prevProps.item.id === nextProps.item.id && prevProps.paused === nextProps.paused;
})

const VideosFeed = ({ navigation }: StackScreenProps<any>) => {

    const { ndk } = useNDKStore()
    const isFetching = useRef<boolean>(false) 
    const lastTimestamp = useRef<number>()
    const { feedSettings } = useFeedVideosStore()
    const { useTranslate } = useTranslateService()
    const [videos, setVideos] = useState<NDKEvent[]>([])
    const [paused, setPaused] = useState<boolean>(false)
    const [playingIndex, setPlayingIndex] = useState<number>(0) 
    const [downloading, setDownloading] = useState<boolean>(false)
    const [downloadProgress, setDownloadProgress] = useState<number>(0)
    const [filtersVisible, setFiltersVisible] = useState<boolean>(false)

    useEffect(() => {
        const unsubscribe = navigation.addListener("blur", () => {
            isFetching.current = false
            setPaused(true)
        })
        return unsubscribe
    }, [])

    useEffect(() => {
        setVideos([])
        lastTimestamp.current = undefined
        setTimeout(fetchVideos, 20)
    }, [feedSettings])

    useFocusEffect(() => { setPaused(false) })

    const fetchVideos = async () => {
        if(isFetching.current) return
        isFetching.current = true
        const filter: NDKFilter = {
            until: lastTimestamp.current, 
            kinds: [1, 1063], "#t": feedSettings.filterTags, 
        }
        const subscription = ndk.subscribe(filter, {
            cacheUsage: NDKSubscriptionCacheUsage.PARALLEL
        })

        var founds: number = 0
        subscription.on("event", event => {
            if(founds >= feedSettings.VIDEOS_LIMIT) {
                return subscription.stop()
            }
            lastTimestamp.current = event.created_at
            const url = extractVideoUrl(event.content)
            if(url && !videos.find(v => v.id == event.id)) 
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

        setTimeout(() => {
            if(founds <= 0) pushMessage(useTranslate("feed.videos.notfound"))
            subscription.stop()
        }, 3000)
    }

    const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
        if(viewableItems.length > 0) { 
            setPlayingIndex(viewableItems[0].index)
        }
    }, [])

    const renderItem = useCallback(({ item, index }:{ item: NDKEvent, index: number }) => {
        return <MemoizedFeedVideoViewer item={item} 
            paused={index !== playingIndex || paused} 
        /> 
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

    return (
        <SafeAreaView style={theme.styles.container}>
            <FlatList pagingEnabled
                data={videos}
                style={{ flex: 1 }}
                renderItem={renderItem}
                keyExtractor={(item: NDKEvent) => item.id}
                showsVerticalScrollIndicator={false}
                viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
                onViewableItemsChanged={onViewableItemsChanged}
                onEndReached={fetchVideos}
                onEndReachedThreshold={.2}
                removeClippedSubviews
                maxToRenderPerBatch={5}
                initialNumToRender={5} 
                windowSize={5}
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

const EndLoader = () => (
    <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size={30} color={theme.colors.white} />
    </View>
)

const styles = StyleSheet.create({
    downloadProgressContent: { position: "absolute", top: 300, alignItems: "center", 
        minWidth: 100, padding: 5, borderRadius: 10, backgroundColor: theme.colors.blueOpacity },

})

export default VideosFeed
