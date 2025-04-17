import { useTranslateService } from "@src/providers/translateProvider"
import { timeSeconds } from "@services/converter"
import { NDKFilter, NDKKind, NDKSubscription, NDKSubscriptionCacheUsage, 
    NostrEvent } from "@nostr-dev-kit/ndk-mobile"
import useNDKStore from "@services/zustand/ndk"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { VideoSource } from "../commons/header"
import { useFeedVideosStore } from "@services/zustand/feedVideos"
import { useFocusEffect } from "@react-navigation/native"
import { pushMessage } from "@services/notification"
import { extractVideoUrl } from "@src/utils"

export const useVideos =({ navigation }: any) => {
   
    const { ndk } = useNDKStore()
    const timeout = useRef<any>()
    const events = useRef(new Set())
    const { useTranslate } = useTranslateService()
    const subscription = useRef<NDKSubscription>()
    const lastTimestamp = useRef<number>(timeSeconds.now())
    const isFetching = useRef<boolean>(false) 
    const [videos, setVideos] = useState<NostrEvent[]>([])
    const [paused, setPaused] = useState<boolean>(false)
    const [playingIndex, setPlayingIndex] = useState<number>(0)
    const [source, setSource] = useState<VideoSource>("relays")
    const { feedSettings, savedEvents, blackList } = useFeedVideosStore()

    const savedVideos = useMemo(() => videos, [videos])

    useEffect(() => {
        loadResetFeed()
        const unsubscribe = navigation.addListener("blur", () => {
            isFetching.current = false
            subscription.current?.stop()
            subscription.current = undefined
            setPaused(true)
        })
        return unsubscribe
    }, [feedSettings.filterTags, source])

    const loadResetFeed = () => {
        setVideos([])
        events.current.clear()
        lastTimestamp.current = timeSeconds.now() 
        fetchVideos()
    }

    useFocusEffect(() => { setPaused(false) })

    const fetchVideos = useCallback(() => {
        if(isFetching.current) return;
        if(source == "saved") {
            if(videos.length == savedEvents.size)
                return pushMessage(useTranslate("feed.videos.notfound"))
            return setVideos(Array.from(savedEvents))
        }

        isFetching.current = true

        const filter: NDKFilter = {
            until: lastTimestamp.current, 
            "#t": feedSettings.filterTags,
            kinds: [NDKKind.Text, NDKKind.Media] 
        }

        if(subscription.current) {
            subscription.current.stop()
            subscription.current.removeAllListeners()
            subscription.current = undefined
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
                    setVideos(prev => [...prev, { 
                        id: event.id,
                        kind: event.kind,
                        pubkey: event.pubkey,
                        tags: event.tags,
                        content: event.content,
                        created_at: event.created_at,
                        sig: event.sig
                    } as NostrEvent])
                    events.current.add(event.id)
                    founds ++
                }
            }
        })
        
        const finishFetch = () => {
            clearTimeout(timeout.current)
            setTimeout(() => isFetching.current = false, 20)
            subscription.current?.removeAllListeners()
            subscription.current = undefined
        }
        
        subscription.current.on("eose", finishFetch)
        subscription.current.on("close", finishFetch)

        timeout.current = setTimeout(() => {
            if(founds === 0) pushMessage(useTranslate("feed.videos.notfound"))
            subscription.current?.stop()
        }, 5000)
    }, [feedSettings, source])

    return {
        paused,
        savedVideos,
        playingIndex,
        setPlayingIndex,
        setSource,
        fetchVideos
    }
}
