import useNDKStore from "@/src/services/zustand/ndk"
import { NDKEvent, NDKFilter, NDKSubscription, NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { useCallback, useEffect, useRef, useState } from "react"
import { View, FlatList, SafeAreaView } from "react-native"
import { extractVideoUrl } from "@/src/utils"
import { useFocusEffect } from "@react-navigation/native"
import { ActivityIndicator } from "react-native-paper"
import FeedVideoViewer from "./viewer"
import theme from "@/src/theme"
import { useFeedVideosStore } from "@/src/services/zustand/feedVideos"

const VideosFeed = ({ navigation }: StackScreenProps<any>) => {

    const urls:string[] = []
    const { ndk } = useNDKStore()
    const { feedSettings } = useFeedVideosStore()
    const listRef = useRef<FlatList>(null)
    const subscriptionRef = useRef<NDKSubscription>()
    const isFetching:any = useRef<boolean>(null)
    const [playingIndex, setPlayingIndex] = useState<number>(0)
    const [muted, setMuted] = useState<boolean>(false)
    const [paused, setPaused] = useState<boolean>(false)
    const [videos, setVideos] = useState<NDKEvent[]>([])
    const [lastEventTimestamp, setLastEventTimestamp] = useState<number>();

    useEffect(() => { 
        const unsubscribe = navigation.addListener("blur", () => {
            setVideos([])
        })
        return unsubscribe
    }, [feedSettings])

    useFocusEffect(() => { loadVideosData() })

    const loadVideosData = async () => {
        if(isFetching.current) return
       
        isFetching.current = true

        if(subscriptionRef.current)
            subscriptionRef.current.stop()

        const filter: NDKFilter = {
            until: lastEventTimestamp, 
            kinds: [1, 1063], "#t": feedSettings.filterTags, 
            limit: feedSettings.FETCH_LIMIT
        }

        subscriptionRef.current = ndk.subscribe(filter, { 
            cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST
        })

        subscriptionRef.current.on("event", event => {
            const url = extractVideoUrl(event.content)
            if(url && !urls.includes(url)) {
                setLastEventTimestamp(event.created_at)
                if(videos.filter(e => e.id == event.id).length == 0) {
                    setVideos(prev => {
                        const events = [...prev, event]
                        if(events.length > feedSettings.VIDEOS_LIMIT) events.slice(0, 1)
                        //     return events.slice(-feedSettings.VIDEOS_LIMIT)
                        return events
                    })
                    urls.push(url)
                }
            }
        })

        subscriptionRef.current.start()

        setTimeout(() => {
            isFetching.current = false;
            if(subscriptionRef.current) subscriptionRef.current.stop()
        }, 1500)
    }

    const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
        if(viewableItems.length > 0) {
            setPlayingIndex(viewableItems[0].index)
        }
    }, [])

    const renderItem = useCallback(({ item, index }:{ item: NDKEvent, index: number }) => {
        console.log("renderItem")
        const url = extractVideoUrl(item.content)
        return (
            <FeedVideoViewer
                key={item.id}
                url={url??""}
                event={item}
                muted={muted}
                setMuted={setMuted}
                setPaused={setPaused}
                paused={index != playingIndex || paused} 
            />
        ) 
    }, [playingIndex, paused, muted])
    
    const EndLoader = () => (
        <View style={{ paddingVertical: 20 }}>
            <ActivityIndicator size={30} color={theme.colors.white}/>
        </View>
    )

    return (
        <SafeAreaView style={theme.styles.container}>
            <FlatList ref={listRef} 
                pagingEnabled
                data={videos}
                extraData={{ paused, muted }}
                style={{ flex: 1 }}
                renderItem={renderItem}
                keyExtractor={(item: NDKEvent) => item.id}
                showsVerticalScrollIndicator={false}
                viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
                onViewableItemsChanged={onViewableItemsChanged}
                onEndReached={loadVideosData}
                onEndReachedThreshold={.5}
                removeClippedSubviews
                initialNumToRender={3} 
                windowSize={3} 
                snapToAlignment="center"
                decelerationRate="fast" 
                ListFooterComponent={<EndLoader/>}
            />
        </SafeAreaView>
    )
}

export default VideosFeed
