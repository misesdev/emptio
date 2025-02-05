import VideoViewer from "@/src/components/nostr/event/VideoViewer"
import useNDKStore from "@/src/services/zustand/ndk"
import { NDKEvent, NDKFilter, NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { useCallback, useEffect, useRef, useState } from "react"
import { StyleSheet, FlatList, SafeAreaView, Dimensions } from "react-native"
import { ActivityIndicator } from "react-native-paper"
import { extractVideoUrl } from "@/src/utils"
import theme from "@/src/theme"

const MAX_VIDEOS = 15

const VideosFeed = ({ navigation }: StackScreenProps<any>) => {

    const { ndk } = useNDKStore()
    const listRef = useRef(null)
    const isFetching:any = useRef(null)
    const currentIndex:any = useRef(null)
    const [playingIndex, setPlayingIndex] = useState(null)
    const [visible, setVisible] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(true)
    const [videoMuted, setVideoMuted] = useState<boolean>(false)
    const [videoEvents, setVideoEvents] = useState<NDKEvent[]>([])
    const [lastEventTimestamp, setLastEventTimestamp] = useState<number>();

    useEffect(() => { 
        loadVideosData()
        return navigation.addListener("blur", () => {
            setVisible(false)
        })
    }, [])

    const loadVideosData = async () => {
        if(isFetching.current) return;
        
        setLoading(true)

        const filter: NDKFilter[] = [
            { until: lastEventTimestamp, kinds: [1, 1063], "#t": ["video"], limit: 10 }, 
            { until: lastEventTimestamp, kinds:[1, 1063], "#url":["mp4","webm"], limit: 10 },
            { until: lastEventTimestamp, kinds:[1, 1063], "#m":["video"], limit: 10 }
        ]

        const subscription = ndk.subscribe(filter, { 
            cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST
        })

        subscription.on("event", event => {
            const url = extractVideoUrl(event.content)
            if(url) {
                setLastEventTimestamp(event.created_at)
                setVideoEvents(prev => {
                    var updatedEvents = [...prev.filter(e => e.id != event.id), event]
                    updatedEvents =  updatedEvents.length > MAX_VIDEOS ? 
                        updatedEvents.slice(-MAX_VIDEOS) 
                        : updatedEvents  
                    return updatedEvents
                })
            }
        })

        subscription.start()

        setTimeout(() => {
            isFetching.current = false
            subscription.stop()
            setLoading(false)
        })
    }

    const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
        if(viewableItems.length > 0 && visible) {
            const newer = viewableItems[0].index 
            if(currentIndex.current != newer) {
                currentIndex.current = newer
                setPlayingIndex(newer)
            }
        }
    }, [visible])

    const renderItem = useCallback(({ item, index }:{ item: NDKEvent, index: number }) => {
        
        const url = extractVideoUrl(item.content)
        
        if(!url) return <></>
        //if(playingIndex > (index-2)) return <></>

        return (
            <VideoViewer url={url}
                fullScreen
                hideFullscreen
                muted={videoMuted}
                setMuted={setVideoMuted}
                paused={index != playingIndex} 
                redute={0} 
            />
        )
    }, [playingIndex, visible])

    const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 }).current

    const LoaderIndicator = () => {
        if(!loading) return <></>
        return <ActivityIndicator style={{ margin: 34 }} color={theme.colors.blue} size={24} />
    }

    if(!visible) setPlayingIndex(null)

    return (
        <SafeAreaView style={theme.styles.container}>
            <FlatList ref={listRef} 
                pagingEnabled
                data={videoEvents}
                style={styles.listContainer}
                renderItem={renderItem}
                extraData={(item: NDKEvent) => item.id}
                showsVerticalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                snapToAlignment="center"
                decelerationRate="fast"
                viewabilityConfig={viewConfigRef}
                onEndReached={loadVideosData}
                onEndReachedThreshold={.5}
                //ListEmptyComponent={<ActivityIndicator color={theme.colors.blue} size={24} />}
                ListFooterComponent={<LoaderIndicator />}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    listContainer: { width: "100%", height: "100%", backgroundColor: theme.colors.black }
})

export default VideosFeed
