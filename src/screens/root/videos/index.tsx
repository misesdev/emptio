import { NDKEvent } from "@nostr-dev-kit/ndk-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { useCallback, useEffect, useState } from "react"
import { View, FlatList, SafeAreaView, Text, StyleSheet } from "react-native"
import { extractVideoUrl } from "@src/utils"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useFeedVideosStore } from "@services/zustand/feedVideos"
import { useFocusEffect } from "@react-navigation/native"
import { ActivityIndicator } from "react-native-paper"
import VideosHeader from "./commons/header"
import VideosFilters from "./commons/filters"
import { blobService } from "@/src/services/blob"
import { noteService } from "@/src/services/nostr/noteService"
import FeedVideoViewer from "./viewer"
import theme from "@src/theme"

const VideosFeed = ({ navigation }: StackScreenProps<any>) => {

    const { feedSettings } = useFeedVideosStore()
    const [muted, setMuted] = useState<boolean>(false)
    const [paused, setPaused] = useState<boolean>(false)
    const [videos, setVideos] = useState<NDKEvent[]>([])
    const [playingIndex, setPlayingIndex] = useState<number>(0)
    const [downloading, setDownloading] = useState<boolean>(false)
    const [downloadProgress, setDownloadProgress] = useState<number>(0)
    const [filtersVisible, setFiltersVisible] = useState<boolean>(false)

    useEffect(() => {
        const unsubscribe = navigation.addListener("blur", () => {
            setPaused(true)
        })
        return unsubscribe
    }, [])

    useEffect(() => {
        setTimeout(async () => await loadVideosData(), 20)
    }, [feedSettings.filterTags])

    useFocusEffect(() => { setPaused(false) })

    const loadVideosData = async () => {
        const notes = await noteService.subscriptionVideos({ videos })
        setVideos(notes)
    }

    const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
        if(viewableItems.length > 0) {
            setPlayingIndex(viewableItems[0].index)
        }
    }, [])

    const renderItem = useCallback(({ item, index }:{ item: NDKEvent, index: number }) => {
        const url = extractVideoUrl(item.content)
        return (
            <FeedVideoViewer
                url={url??""}
                event={item}
                muted={muted}
                setMuted={setMuted}
                paused={index != playingIndex || paused} 
            />
        ) 
    }, [playingIndex, muted, paused])

    const EndLoader = () => (
        <View style={{ paddingVertical: 20 }}>
            <ActivityIndicator size={30} color={theme.colors.white}/>
        </View>
    )

    const handleDownload = async () => {
        if(videos.length) return
        const event = videos[playingIndex]
        const url = extractVideoUrl(event.content)
        if(url) {
            blobService.downloadVideo({ 
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
                extraData={{ playingIndex, muted, paused }}
                renderItem={renderItem}
                keyExtractor={(item: NDKEvent) => item.id}
                showsVerticalScrollIndicator={false}
                viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
                onViewableItemsChanged={onViewableItemsChanged}
                onEndReached={loadVideosData}
                onEndReachedThreshold={.2}
                removeClippedSubviews
                maxToRenderPerBatch={3}
                initialNumToRender={3} 
                windowSize={3}
                snapToAlignment="center"
                decelerationRate="fast" 
                ListFooterComponent={<EndLoader/>}
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
        minWidth: 100, padding: 5, borderRadius: 10, 
        backgroundColor: theme.colors.blueOpacity },

})

export default VideosFeed
