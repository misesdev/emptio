import { extractVideoUrl } from "@src/utils"
import { NostrEvent } from "@nostr-dev-kit/ndk-mobile"
import { useEffect, useRef, useState } from "react"
import { Dimensions } from "react-native"

export const useVideoViewer = (event: NostrEvent) => {

    const videoRef = useRef<any>(null)
    const { width, height } = Dimensions.get("window")
    const [duration, setDuration] = useState<number>(0)
    const [currentTime, setCurrentTime] = useState<number>(0)
    const [error, setError] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const url = useRef(extractVideoUrl(event.content)??"").current

    useEffect(() => {
        const unsubscribe = () => {
            if(videoRef.current) {
                videoRef.current?.seek(0)
                videoRef.current = null 
            }
        }
        return unsubscribe
    }, [])

    const onLoadVideo = (data: any) => {
        setDuration(data?.duration||0)
        setLoading(false)
    }

    const onProgressVideo = (data: any) => { 
        setCurrentTime(data?.currentTime||0)
    }

    const handleSeek = (time: number) => {
        if(videoRef.current) {
            videoRef.current.seek(time)
            setCurrentTime(time)
        }
    }

    return {
        width,
        height,
        url,
        loading,
        videoRef,
        duration,
        currentTime,
        error,
        setError,
        onLoadVideo,
        onProgressVideo,
        handleSeek
    }
}
