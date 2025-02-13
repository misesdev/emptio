import { NDKEvent } from "@nostr-dev-kit/ndk-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { useCallback, useEffect, useRef, useState } from "react"
import { View, FlatList, SafeAreaView, Text, StyleSheet } from "react-native"
import { extractVideoUrl } from "@src/utils"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useFeedVideosStore } from "@services/zustand/feedVideos"
import { useFocusEffect } from "@react-navigation/native"
import { ActivityIndicator } from "react-native-paper"
import VideosHeader from "./commons/header"
import VideosFilters from "./commons/filters"
import { blobService } from "@services/blob"
import { noteService } from "@services/nostr/noteService"
import { pushMessage } from "@services/notification"
import { useTranslateService } from "@src/providers/translateProvider"
import FeedVideoViewer from "./viewer"
import theme from "@src/theme"

const VideosFeed = ({ navigation }: StackScreenProps<any>) => {

    const isFetching = useRef<boolean>(false) 
    const { feedSettings } = useFeedVideosStore()
    const { useTranslate } = useTranslateService()
    const videos = useRef<NDKEvent[]>([])
    const paused = useRef<boolean>(false)
    const playingIndex = useRef<number>(0) 
    const [downloading, setDownloading] = useState<boolean>(false)
    const [downloadProgress, setDownloadProgress] = useState<number>(0)
    const [filtersVisible, setFiltersVisible] = useState<boolean>(false)

    useEffect(() => {
        const unsubscribe = navigation.addListener("blur", () => {
            isFetching.current = false
            paused.current = true
        })
        return unsubscribe
    }, [])

    useEffect(() => {
        videos.current = []
        loadVideosData()
    }, [feedSettings])

    useFocusEffect(() => { paused.current = false })

    const loadVideosData = () => {
        if(isFetching.current) return
        isFetching.current = true
        noteService.subscriptionVideos({ videos: videos.current }).then(events => {
            setTimeout(() => isFetching.current = false, 20)
            videos.current = videos.current.concat(events)
        }).catch(() => {
            pushMessage(useTranslate("message.default_error"))
            setTimeout(() => isFetching.current = false, 20)
        })
    }

    const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
        if(viewableItems.length > 0) { 
            playingIndex.current = viewableItems[0].index
        }
    }, [])

    const renderItem = useCallback(({ item, index }:{ item: NDKEvent, index: number }) => {
        console.log("renderItem")
        const url = extractVideoUrl(item.content)
        return (
            <FeedVideoViewer url={url??""} event={item}
                paused={index != playingIndex.current || paused.current} 
            />
        ) 
    }, [playingIndex, paused])

    const EndLoader = () => (
        <View style={{ paddingVertical: 20 }}>
            <ActivityIndicator size={30} color={theme.colors.white}/>
        </View>
    )

    const handleDownload = async () => {
        if(videos.current.length <= 0) return
        const event = videos.current[playingIndex.current]
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
                data={videos.current}
                extraData={{ playingIndex, paused }}
                style={{ flex: 1 }}
                renderItem={renderItem}
                keyExtractor={(item: NDKEvent) => item.id}
                showsVerticalScrollIndicator={false}
                viewabilityConfig={{ itemVisiblePercentThreshold: 20 }}
                onViewableItemsChanged={onViewableItemsChanged}
                onEndReached={loadVideosData}
                onEndReachedThreshold={.2}
                removeClippedSubviews
                maxToRenderPerBatch={5}
                initialNumToRender={5} 
                windowSize={5}
                snapToAlignment="center"
                decelerationRate="fast" 
                ListFooterComponent={<EndLoader/>}
            />

            {/* <VideosHeader  */}
            {/*     downloading={downloading}  */}
            {/*     handleDownload={handleDownload} */}
            {/*     handleManageFilters={() => setFiltersVisible(true)} */}
            {/* /> */}

            {/* {downloading && */}
            {/*     <View style={styles.downloadProgressContent}> */}
            {/*         <Ionicons name={"cloud-download"} size={18} color={theme.colors.white} /> */}
            {/*         <Text style={{ fontSize: 16, color: theme.colors.white }}> */}
            {/*             {downloadProgress.toFixed(0)}% */}
            {/*         </Text> */}
            {/*     </View> */}
            {/* } */}
            {/* <VideosFilters visible={filtersVisible} setVisible={setFiltersVisible} /> */}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    downloadProgressContent: { position: "absolute", top: 300, alignItems: "center", 
        minWidth: 100, padding: 5, borderRadius: 10, backgroundColor: theme.colors.blueOpacity },

})

export default VideosFeed
