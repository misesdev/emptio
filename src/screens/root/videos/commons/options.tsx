import { ButtonPrimary } from "@/src/components/form/Buttons"
import { useTranslateService } from "@/src/providers/translateProvider"
import { StyleSheet, Modal, View, ScrollView, TouchableOpacity, Text } from "react-native"
import { SectionHeader } from "@/src/components/general/section/headers"
import { useSettings } from "@/src/providers/settingsProvider"
import { FormControl } from "@/src/components/form/FormControl"
import Ionicons from 'react-native-vector-icons/Ionicons'
import theme from "@/src/theme"
import { useState } from "react"

type Props = {
    visible: boolean,
    setVisible: (state: boolean) => void 
}

const VideoPostOptions = ({ visible, setVisible }: Props) => {
    
    const { feedVideos } = useSettings()
    const { useTranslate } = useTranslateService()
    const [tagNameText, setTagNameText] = useState<string>()
    const [filterTags, setFilterTags] = useState<string[]>(feedVideos?.filterTags ??[])

    const handleAddTagfilter = () => {
        
    }

    const handleRemoveTag = (tag: string) => {
        setFilterTags(prev => prev.filter(t => t != tag))
        //settings.feedVideo?.filterTags = settings.feedVideo?.filterTags
        // if (setSettings) 
        //     setSettings()
    }

    return (
        <Modal transparent visible={visible}
            onRequestClose={() => setVisible(false)}
        >
            <ScrollView style={styles.container}>

                <SectionHeader label="filters" icon="filter" />

                <View style={styles.tagadd}>
                    <View style={{ width: "85%" }}>
                        <FormControl showLabel={false} 
                            label="add tag filter"
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
                </View>

            </ScrollView>
            <View style={styles.closebutton}>
                <ButtonPrimary label={useTranslate("commons.close")} onPress={() => setVisible(false)} />
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.semitransparentdark },
    tagadd: { width: "100%", padding: 10, flexDirection: "row" },
    addbutton: { padding: 10, borderRadius: 50, justifyContent: "center", 
        alignItems: "center", backgroundColor: theme.colors.blue },
    tagarea: { width: "100%", padding: 10, flexDirection: "row" },
    tagitem: { margin: 4, width: "auto", padding: 10, borderRadius: 10, flexDirection: "row",
        color:  theme.colors.white, backgroundColor: theme.colors.section },

    closebutton: { position: "absolute", width: "100%", bottom: 10 },
})

export default VideoPostOptions
