import { ButtonPrimary } from "@/src/components/form/Buttons"
import { useTranslateService } from "@/src/providers/translateProvider"
import { StyleSheet, Modal, View, ScrollView, TouchableOpacity, Text } from "react-native"
import { SectionHeader } from "@/src/components/general/section/headers"
import { FormControl } from "@/src/components/form/FormControl"
import Ionicons from 'react-native-vector-icons/Ionicons'
import theme from "@/src/theme"
import { useState } from "react"
import { useFeedVideosStore } from "@/src/services/zustand/feedVideos"
import { saveFeedVideoSettings } from "@/src/services/memory/settings"

type Props = {
    visible: boolean,
    setVisible: (state: boolean) => void 
}

const VideoPostOptions = ({ visible, setVisible }: Props) => {
    
    const { feedSettings, setFeedSettings } = useFeedVideosStore()
    const { useTranslate } = useTranslateService()
    const [tagNameText, setTagNameText] = useState<string>()
    const [filterTags, setFilterTags] = useState<string[]>(feedSettings.filterTags)

    const handleAddTagfilter = () => {
        if(!tagNameText) return;
        const hashtag = tagNameText.replaceAll("#", "").trim()
        if(filterTags.find(t => t == hashtag)) return
        setFilterTags(prev => [...prev, hashtag])
        setTagNameText("")
    }

    const handleRemoveTag = (tag: string) => {
        if(filterTags.length <= 1) return

        setFilterTags(prev => prev.filter(t => t != tag))
    }

    const handleSave = () => {
        setTimeout(() => { 
            feedSettings.filterTags = filterTags
            setFeedSettings(feedSettings)
            saveFeedVideoSettings(feedSettings)
            setVisible(false)
        }, 20)
    }

    return (
        <Modal transparent visible={visible} animationType="slide"
            onRequestClose={() => setVisible(false)}
        >
           <View style={styles.overlayer}> 
                <View style={styles.modalContainer}>
                    <SectionHeader label={useTranslate("commons.filters")} icon="filter" />

                    <View style={styles.tagadd}>
                        <View style={{ width: "85%" }}>
                            <FormControl showLabel={false} 
                                label={useTranslate("feed.videos.addtag")}
                                onChangeText={(value) => setTagNameText(value.toLowerCase())}
                                value={tagNameText}
                            />
                        </View>
                        <View style={{ width: "15%", paddingVertical: 12 }}>
                            <TouchableOpacity onPress={handleAddTagfilter} style={styles.addbutton}>
                                <Ionicons name="add" size={24} color={theme.colors.white} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView style={{ flex: 1 }}>
                        <View style={styles.tagarea}>
                            {filterTags.length &&
                                filterTags.map((tag: string, key: number) => {
                                    return (
                                        <Text key={key} style={styles.tagitem} 
                                            onPress={() => handleRemoveTag(tag)}
                                        >
                                            #{tag}
                                            <Ionicons name="close" size={15} color={theme.colors.white} />
                                        </Text>
                                    )
                                })
                            }
                            <View style={{ height: 75 }}></View>
                        </View>

                    </ScrollView>
                    <View style={styles.closebutton}>
                        <ButtonPrimary label={useTranslate("commons.save")} onPress={handleSave} />
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlayer: { flex: 1, justifyContent: "flex-end", backgroundColor: theme.colors.transparent },
    modalContainer: {
        height: "80%",
        backgroundColor: theme.colors.semitransparentdark,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: 0,
    },
    container: { flex: 1, backgroundColor: theme.colors.semitransparentdark },
    tagadd: { width: "100%", padding: 10, flexDirection: "row" },
    addbutton: { padding: 10, borderRadius: 50, justifyContent: "center", 
        alignItems: "center", backgroundColor: theme.colors.blue },
    tagarea: { width: "100%", padding: 10, alignItems: "center" },
    tagitem: { margin: 4, width: "auto", padding: 10, borderRadius: 10, flexDirection: "row",
        color:  theme.colors.white, backgroundColor: theme.colors.section },

    closebutton: { position: "absolute", width: "100%", paddingHorizontal: 24, bottom: 10 },
})

export default VideoPostOptions
