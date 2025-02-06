import useNDKStore from "@/src/services/zustand/ndk"
import { NDKEvent, NDKFilter, NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { useCallback, useEffect, useRef, useState } from "react"
import { View, StyleSheet, FlatList, SafeAreaView } from "react-native"
import { extractVideoUrl } from "@/src/utils"
import theme from "@/src/theme"
import FeedVideoViewer from "./viewer"
import { useFocusEffect } from "@react-navigation/native"
import { ActivityIndicator } from "react-native-paper"

const LIMIT_LIST_VIDEOS = 45
const LIMIT_FECTH_VIDEOS = 75

const VideosFeed = ({ navigation }: StackScreenProps<any>) => {

    const urls:string[] = []
    const { ndk } = useNDKStore()
    const listRef = useRef<FlatList>(null)
    const isFetching:any = useRef(null)
    const currentIndex:any = useRef(null)
    const [playingIndex, setPlayingIndex] = useState<number>(0)
    const [videoMuted, setVideoMuted] = useState<boolean>(false)
    const [videoPaused, setVideoPaused] = useState<boolean>(false)
    const [videoEvents, setVideoEvents] = useState<NDKEvent[]>([])
    const [lastEventTimestamp, setLastEventTimestamp] = useState<number>();

    useEffect(() => { 
        loadVideosData()
        const unsubscribe = navigation.addListener("blur", () => {
            setVideoPaused(true)
        })
        return unsubscribe
    }, [])

    useFocusEffect(() => setVideoPaused(false))

    const loadVideosData = async () => {
        if(isFetching.current) return
       
        isFetching.current = true

        const tags: string[] = [
            "video",
            "meme",
            "memes",
            "memestr",
        ]

        const filter: NDKFilter[] = [
            { until: lastEventTimestamp, kinds: [1, 1063], "#t": tags, limit: LIMIT_FECTH_VIDEOS }, 
        ]

        const subscription = ndk.subscribe(filter, { 
            cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST
        })

        subscription.on("event", event => {
            const url = extractVideoUrl(event.content)
            if(url && !urls.includes(url)) {
                setLastEventTimestamp(event.created_at)
                if(videoEvents.filter(e => e.id == event.id).length == 0) {
                    setVideoEvents(prev => {
                        const events = [...prev, event]
                        // if(events.length > LIMIT_LIST_VIDEOS)
                        //     return events.slice(-LIMIT_LIST_VIDEOS)
                        return events
                    })
                    urls.push(url)
                }
            }
        })

        subscription.start()

        setTimeout(() => {
            isFetching.current = false;
            subscription.stop()
        }, 5000)
    }

    const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
        if(viewableItems.length > 0) {
            // if(currentIndex.current != viewableItems[0].index) {
            //     currentIndex.current = viewableItems[0].index
                setPlayingIndex(viewableItems[0].index)
            //}
        }
    }, [])

    const renderItem = useCallback(({ item, index }:{ item: NDKEvent, index: number }) => {
        const url = extractVideoUrl(item.content)
        return (
            <FeedVideoViewer
                key={item.id}
                url={url??""}
                event={item}
                muted={videoMuted}
                setMuted={setVideoMuted}
                paused={index != playingIndex || videoPaused} 
            />
        ) 
    }, [playingIndex, videoPaused])
    
    const EndLoader = () => (
        <View style={{ paddingVertical: 20 }}>
            <ActivityIndicator size={30} color={theme.colors.white}/>
        </View>
    )

    return (
        <SafeAreaView style={theme.styles.container}>
            <FlatList ref={listRef} 
                pagingEnabled
                data={videoEvents}
                style={{ flex: 1 }}
                renderItem={renderItem}
                keyExtractor={(item: NDKEvent) => item.id}
                showsVerticalScrollIndicator={false}
                viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
                onViewableItemsChanged={onViewableItemsChanged}
                onEndReached={loadVideosData}
                onEndReachedThreshold={.5}
                removeClippedSubviews
                initialNumToRender={5} 
                windowSize={5} 
                snapToAlignment="center"
                decelerationRate="fast" 
                ListFooterComponent={<EndLoader/>}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    listContainer: { width: "100%", height: "100%", backgroundColor: theme.colors.black }
})

export default VideosFeed
