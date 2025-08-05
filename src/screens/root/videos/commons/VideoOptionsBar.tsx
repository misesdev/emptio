import { NDKEvent } from "@nostr-dev-kit/ndk-mobile"
import { Modal, StyleSheet, View, Text, TouchableOpacity, Animated } from "react-native"
import { useTranslateService } from "@src/providers/TranslateProvider"
import { useFeedVideosStore } from "@services/zustand/useFeedVideoStore"
import { useService } from "@src/providers/ServiceProvider"
import Ionicons from "react-native-vector-icons/Ionicons"
import { memo, useEffect, useState } from "react"
import { ScrollView } from "react-native-gesture-handler"
import { showVideoFilters } from "./VideosFilters"
import { Utilities } from "@src/utils/Utilities"
import theme from "@src/theme"

var showOptionsFunction: () => void

interface VideoOptionProps {
    event: NDKEvent;
}

const VideoOptionsBar = ({ event }: VideoOptionProps) => {

    const { blobService } = useService()
    const { useTranslate } = useTranslateService()
    const [visible, setVisible] = useState(false)
    const [hasSaved, setHasSaved] = useState(false)
    const [downloadProgress, setDownloadProgress] = useState(0)
    const { savedEvents, blackList } = useFeedVideosStore()
    const animatedProgress = new Animated.Value(downloadProgress)

    useEffect(() => {
        Animated.timing(animatedProgress, {
            toValue: downloadProgress,
            duration: 200, 
            useNativeDriver: false,
        }).start()
    }, [downloadProgress])

    showOptionsFunction = () => {
        setHasSaved(Array.from(savedEvents).some(e => e.id == event.id))
        setVisible(true)
    }

    const handleSave = async () => {
        if(hasSaved) {
            setHasSaved(false)
            //storageService.database.events.delete(event.id??"")
            savedEvents.delete(event)
        } else {
            setHasSaved(true)
            //storageService.database.events.insert({ event: event as NDKEvent, category: "videos" })
            savedEvents.add(event)
        }
    }

    const handleBlock = () => {
        //storageService.settings.blackList.add(event.pubkey)
        blackList.add(event.pubkey)
    }

    const handleFilters = () => {
        setVisible(false)
        showVideoFilters()
    }
    
    const handleDownload = () => {
        const url = Utilities.extractVideoUrl(event.content)
        if(url) { 
            blobService.download({ url, setDownloadProgress })
        }
    }

    const progressHeight = animatedProgress.interpolate({
        inputRange: [0, 100],
        outputRange: ["0%", "100%"],
    })

    return (
        <Modal visible={visible} transparent animationType="slide"
            onRequestClose={() => setVisible(false)}>
            <View style={styles.overlayer}>
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            {useTranslate("commons.options")}
                        </Text>
                        <TouchableOpacity onPress={() => setVisible(false)}>
                            <Text style={styles.closeButton}>✕</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={theme.styles.row}>
                        <View style={{ width: "25%", alignItems: "center" }}>
                            <TouchableOpacity onPress={handleFilters} style={styles.topOptionButton}>
                                <Ionicons name="funnel" size={24} color={theme.colors.white} />
                            </TouchableOpacity>
                        </View> 
                        <View style={{ width: "25%", alignItems: "center" }}>
                            <TouchableOpacity style={styles.topOptionButton}>
                                <Ionicons name="flash" size={24} color={theme.colors.white} />
                            </TouchableOpacity>
                        </View> 
                        <View style={{ width: "25%", alignItems: "center" }}>
                            <TouchableOpacity onPress={handleDownload} style={styles.downloadButton}>
                                <View style={styles.progressContainer}>
                                    <Animated.View style={[styles.progressBar, { height: progressHeight }]} />
                                </View>
                                <Ionicons name="cloud-download" size={24} color={theme.colors.white} />
                            </TouchableOpacity>
                        </View> 
                        <View style={{ width: "25%", alignItems: "center" }}>
                            <TouchableOpacity onPress={handleSave} style={[styles.topOptionButton,{
                                    backgroundColor: hasSaved ? theme.colors.blue : theme.colors.blueOpacity
                                }]}
                            >
                                <Ionicons name="bookmarks" size={24} color={theme.colors.white} />
                            </TouchableOpacity>
                        </View> 
                    </View>
                    <ScrollView style={{ flex: 1 }}>
                         
                    </ScrollView>
                </View>
            </View>
        </Modal>
    )
}

export const showVideoOptions = () => {
    setTimeout(showOptionsFunction, 20)
}

const styles = StyleSheet.create({
    overlayer: { flex: 1, justifyContent: "flex-end", backgroundColor: theme.colors.transparent,
        padding: 6 },
    modalContainer: { height: "50%", backgroundColor: theme.colors.semitransparentdark,
        borderRadius: 10, padding: 12 },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center",
        marginBottom: 10, paddingHorizontal: 10  },
    title: { fontSize: 18, fontWeight: "bold", color: theme.colors.white },
    closeButton: { fontSize: 22, color: "#555" },
    
    topOptionButton: { padding: 14, borderRadius: 10, backgroundColor: theme.colors.blueOpacity },

    downloadButton: { padding: 14, borderRadius: 10, backgroundColor: theme.colors.blueOpacity, 
        overflow: "hidden", position: "relative", justifyContent: "center", 
        alignItems: "center" },
    progressContainer: { ...StyleSheet.absoluteFillObject, backgroundColor: "transparent",
        overflow: "hidden" },
    progressBar: { position: "absolute", bottom: 0, left: 0, right: 0,
        backgroundColor: theme.colors.green, width: "100%" }
})

export default memo(VideoOptionsBar)

