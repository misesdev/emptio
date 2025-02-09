import useNDKStore from "@services/zustand/ndk"
import { NDKEvent, NDKFilter, NDKSubscription, NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { useCallback, useEffect, useRef, useState } from "react"
import { View, FlatList, SafeAreaView } from "react-native"
import { extractVideoUrl } from "@src/utils"
import { useFeedVideosStore } from "@services/zustand/feedVideos"
import { useFocusEffect } from "@react-navigation/native"
import { ActivityIndicator } from "react-native-paper"
import FeedVideoViewer from "./viewer"
import theme from "@src/theme"

const VideosFeed = ({ navigation }: StackScreenProps<any>) => {

    const { ndk } = useNDKStore()
    const { feedSettings } = useFeedVideosStore()
    const listRef = useRef<FlatList>(null)
    const subscriptionRef = useRef<NDKSubscription>()
    const isFetching:any = useRef<boolean>(null)
    const [playingIndex, setPlayingIndex] = useState<number>(0)
    const [paused, setPaused] = useState<boolean>(false)
    const [videos, setVideos] = useState<NDKEvent[]>([])
    const [lastEventTimestamp, setLastEventTimestamp] = useState<number>();

    useEffect(() => {
        setTimeout(() => loadVideosData(), 50)
        const unsubscribe = navigation.addListener("blur", () => {
            isFetching.current = false
            setPaused(true)
        })
        return unsubscribe
    }, [feedSettings])

    useFocusEffect(() => { setPaused(false) })

    const loadVideosData = async () => {
        if(isFetching.current) return
      
        console.log("fetching events")
        isFetching.current = true

        if(subscriptionRef.current) {
            subscriptionRef.current.stop()
            subscriptionRef.current = undefined
        }

        const filter: NDKFilter = {
            until: lastEventTimestamp, 
            kinds: [1, 1063], "#t": feedSettings.filterTags, 
            //limit: feedSettings.FETCH_LIMIT
        }

        subscriptionRef.current = ndk.subscribe(filter, { 
            cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST
        })

        var foundEventsCount = 0
        subscriptionRef.current.on("event", event => {
            if(foundEventsCount >= feedSettings.VIDEOS_LIMIT) {
                subscriptionRef.current?.stop()
            }
            setLastEventTimestamp(event.created_at)
            const url = extractVideoUrl(event.content)
            if(url)
            {
                if(!videos.some(e => e.id == event.id)) 
                {
                    setVideos(prev => {
                        const events = [...prev, event]
                        // if(events.length >= feedSettings.VIDEOS_LIMIT)
                        //     events.splice(0,1)
                        return events
                    })
                    foundEventsCount++
                }
            }
        })

        // subscriptionRef.current.on("eose", () => {
        //     subscriptionRef.current = undefined
        //     isFetching.current = false
        // })

        subscriptionRef.current.start()

        setTimeout(() => {
            isFetching.current = false
            console.log("end fetching")
        }, 5000)
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
                url={url??""}
                event={item}
                paused={index != playingIndex || paused} 
            />
        ) 
    }, [playingIndex, paused])
    
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
                extraData={{ playingIndex, paused }}
                style={{ flex: 1 }}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
                onViewableItemsChanged={onViewableItemsChanged}
                onEndReached={loadVideosData}
                onEndReachedThreshold={.2}
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

export default VideosFeed
