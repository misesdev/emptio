import { ButtonPrimary } from "@components/form/Buttons"
import { useTranslateService } from "@/src/providers/translateProvider"
import { StyleSheet, Modal, View, ScrollView, TouchableOpacity, Text } from "react-native"
import { FormControl } from "@components/form/FormControl"
import Ionicons from 'react-native-vector-icons/Ionicons'
import theme from "@/src/theme"
import { useState } from "react"
import { useFeedVideosStore } from "@services/zustand/feedVideos"
import { saveFeedVideoSettings } from "@services/memory/settings"

type Props = {
    visible: boolean,
    setVisible: (state: boolean) => void 
}

const VideosFilters = ({ visible, setVisible }: Props) => {
    
    const { feedSettings, setFeedSettings } = useFeedVideosStore()
    const { useTranslate } = useTranslateService()
    const [tagNameText, setTagNameText] = useState<string>()
    const [filterTags, setFilterTags] = useState<string[]>(feedSettings.filterTags)

    const handleAddTagfilter = () => {
        if(!tagNameText) return;
        const hashtag = tagNameText.replaceAll("#", "").trim()
        if(filterTags.find(t => t == hashtag)) return
        setFilterTags(prev => [hashtag, ...prev])
        setTagNameText("")
    }

    const handleRemoveTag = (tag: string) => {
        if(filterTags.length <= 1) return

        setFilterTags(prev => prev.filter(t => t != tag))
    }

    const handleSave = () => {
        feedSettings.filterTags = filterTags
        setFeedSettings(feedSettings)
        saveFeedVideoSettings(feedSettings)
        setVisible(false)
    }

    return (
        <Modal transparent visible={visible} animationType="slide"
            onRequestClose={() => setVisible(false)}
        >
           <View style={styles.overlayer}> 
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>
                            {useTranslate("commons.filters")}
                        </Text>
                        <TouchableOpacity onPress={() => setVisible(false)}>
                            <Text style={styles.closeButton}>✕</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.tagadd}>
                        <View style={{ width: "85%" }}>
                            <FormControl showLabel={false}
                                returnKeyTipe="go"
                                onSubmitEditing={handleAddTagfilter}
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
                                        <TouchableOpacity key={key}
                                            activeOpacity={.7}
                                            style={styles.tagbutton} 
                                            onPress={() => handleRemoveTag(tag)}
                                        >
                                            <Text style={styles.tagitem}>
                                                #{tag}
                                            </Text>
                                            <Ionicons name="close" size={15}
                                                style={styles.tagicon} 
                                                color={theme.colors.white} 
                                            />
                                        </TouchableOpacity>
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
        padding: 10,
    },
    container: { flex: 1, backgroundColor: theme.colors.semitransparentdark },
    tagadd: { width: "100%", flexDirection: "row" },
    addbutton: { padding: 10, borderRadius: 10, justifyContent: "center", 
        alignItems: "center", backgroundColor: theme.colors.blue },
    tagarea: { width: "100%", padding: 10, alignItems: "center", flexDirection: "row",
        flexWrap: "wrap" },
    tagbutton: { margin: 4, padding: 10, borderRadius: 10, color:  theme.colors.white, 
        flexDirection: 'row', backgroundColor: theme.colors.section },
    tagitem: { color:  theme.colors.white },
    tagicon: { margin: 4 },

    closebutton: { position: "absolute", width: "100%", paddingHorizontal: 24, bottom: 10 },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
        paddingHorizontal: 10
    },
    headerText: { fontSize: 18, fontWeight: "bold", color: theme.colors.white },
    closeButton: { fontSize: 22, color: "#555" },
})

export default VideosFilters
