import { ButtonPrimary } from "@components/form/Buttons"
import { useTranslateService } from "@src/providers/translateProvider"
import { StyleSheet, Modal, View, TouchableOpacity, FlatList, Text } from "react-native"
import { FormControl } from "@components/form/FormControl"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useFeedVideosStore } from "@services/zustand/feedVideos"
import { memo, useCallback, useState } from "react"
import theme from "@src/theme"
import { storageService } from "@/src/services/memory"

var showFiltersFunction: () => void

interface TagItemProps { tag: string, handlePress: (tag: string) => void }
const TagItem = memo(({ tag, handlePress }: TagItemProps) => {
    return (
        <TouchableOpacity activeOpacity={.7} style={styles.tagbutton} 
            onPress={() => handlePress(tag)}
        >
            <Text style={styles.tagitem}>#{tag}</Text>
            <Ionicons name="close" size={15} style={styles.tagicon} 
                color={theme.colors.white} 
            />
        </TouchableOpacity>
    )
})

const VideosFilters = () => {
    
    const { feedSettings, setFeedSettings } = useFeedVideosStore()
    const { useTranslate } = useTranslateService()
    const [tagNameText, setTagNameText] = useState<string>("")
    const [filterTags, setFilterTags] = useState<string[]>(feedSettings.filterTags)
    const [visible, setVisible] = useState<boolean>(false)

    showFiltersFunction = () => setVisible(true)

    const handleAddTagfilter = useCallback(() => {
        if(!tagNameText) return;
        const hashtag = tagNameText.replaceAll("#", "").trim()
        if(filterTags.find(t => t == hashtag)) return
        setFilterTags(prev => [hashtag.toLowerCase(), ...prev])
        setTagNameText("")
    }, [tagNameText, filterTags])

    const handleRemoveTag = useCallback((tag: string) => {
        if(!filterTags.length) return
        setFilterTags(prev => [...prev.filter(t => t != tag)])
    }, [filterTags, setFilterTags])

    const handleSave = () => {
        setFeedSettings({...feedSettings, filterTags})
        storageService.settings.feedVideos.save({...feedSettings, filterTags})
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
                                onChangeText={setTagNameText}
                                value={tagNameText}
                            />
                        </View>
                        <View style={{ width: "15%", paddingVertical: 12 }}>
                            <TouchableOpacity onPress={handleAddTagfilter} style={styles.addbutton}>
                                <Ionicons name="add" size={24} color={theme.colors.white} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <FlatList 
                        data={filterTags}
                        keyExtractor={item => item}
                        renderItem={({ item }) => <TagItem tag={item} handlePress={handleRemoveTag} />}
                        contentContainerStyle={styles.tagarea}
                        style={{ flex: 1 }}
                        numColumns={3}
                    />
                    <View style={styles.closebutton}>
                        <ButtonPrimary disabled={!filterTags.length}
                            label={useTranslate("commons.save")}
                            onPress={handleSave} 
                        />
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export const showVideoFilters = () => {
    setTimeout(showFiltersFunction, 20)
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
    tagarea: { width: "100%", padding: 10, alignItems: "center" },
    tagbutton: { margin: 4, padding: 10, borderRadius: 10, color:  theme.colors.white, 
        flexDirection: 'row', backgroundColor: theme.colors.section },
    tagitem: { color:  theme.colors.white, fontWeight: "500" },
    tagicon: { margin: 4 },

    closebutton: { position: "absolute", width: "100%", alignItems: "center",
        paddingHorizontal: 20, bottom: 10 },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center",
        marginBottom: 10, paddingHorizontal: 10
    },
    headerText: { fontSize: 18, fontWeight: "bold", color: theme.colors.white },
    closeButton: { fontSize: 22, color: "#555" },
})

export default VideosFilters
