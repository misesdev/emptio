import { useTranslateService } from "@/src/providers/translateProvider"
import theme from "@src/theme"
import { useState } from "react"
import { StyleSheet, View, TouchableOpacity, Text } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'

export type VideoSource = "relays" | "saved"

interface VideosHeaderProps {
    onChangeSource: (source: VideoSource) => void
}

const VideosHeader = ({ onChangeSource }: VideosHeaderProps) => {
    
    const [source, setSource] = useState<VideoSource>("relays")

    const handleSource = (source: VideoSource) => {
        onChangeSource(source)
        setSource(source)
    }

    return (
        <View style={styles.header}>
            <View style={styles.controls}>
                <View style={{ width: "50%" }}>
                    <TouchableOpacity style={[styles.controlsButton, {
                            backgroundColor: source == "relays" ? theme.colors.semitransparent
                                : theme.colors.transparent
                        }]}
                        onPress={() => handleSource("relays")} 
                    >
                        <Ionicons name="funnel" size={18} color={
                            source == "relays" ? theme.colors.white : theme.colors.gray
                        } />
                    </TouchableOpacity>
                </View>
                <View style={{ width: "50%" }}>
                    <TouchableOpacity style={[styles.controlsButton, {
                            backgroundColor: source == "saved" ? theme.colors.semitransparent 
                                : theme.colors.transparent
                        }]}
                        onPress={() => handleSource("saved")} 
                    >
                        <Ionicons name="bookmarks" size={18} color={
                            source == "saved" ? theme.colors.white : theme.colors.gray
                        }/>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: { position: "absolute", top: 10, padding: 10, width: "100%",
        justifyContent: "center", flexDirection: "row" },
    controls: { width: "34%", borderRadius: 10, overflow: "hidden", flexDirection: "row",
       borderWidth: 1, borderColor: theme.colors.blue }, 
    controlsButton: { width: "100%", padding: 10, justifyContent: "center", flexDirection: "row" },
    buttonLabel: { color: theme.colors.white, fontWeight: "bold", textAlign: "center" }
})

export default VideosHeader
