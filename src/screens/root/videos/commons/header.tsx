import theme from "@/src/theme"
import { StyleSheet, View, TouchableOpacity } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'

type Props = {
    downloading: boolean,
    handleDownload: () => Promise<void>
}
const VideoHeader = ({ downloading, handleDownload }: Props) => {
    return (
        <View style={styles.controlsHeader}>
            {!downloading &&
                <TouchableOpacity style={styles.controlsHeaderButton}
                    onPress={handleDownload}
                >
                    <Ionicons name={"cloud-download-outline"} size={24} color={theme.colors.white} />
                </TouchableOpacity>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    controlsHeader: { position: "absolute", top: 0, padding: 10, width: "100%",
        paddingTop: 30, flexDirection: "row-reverse" },
    controlsHeaderButton: { padding: 4, borderRadius: 10, margin: 4,
        backgroundColor: theme.colors.blueOpacity },
})

export default VideoHeader
