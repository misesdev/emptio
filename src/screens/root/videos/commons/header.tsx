import theme from "@/src/theme"
import { StyleSheet, View, TouchableOpacity } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'

type Props = {
    downloading: boolean,
    handleDownload: () => Promise<void>,
    handleManageFilters: () => void
}
const VideoHeader = ({ downloading, handleDownload, handleManageFilters }: Props) => {
    return (
        <View style={styles.controlsHeader}>
            <View style={{ width: "14%", alignItems: "center" }}>
                {!downloading &&
                    <TouchableOpacity style={styles.controlsHeaderButton}
                        onPress={handleDownload}
                    >
                        <Ionicons name={"cloud-download-outline"} size={24} color={theme.colors.white} />
                    </TouchableOpacity>
                }
            </View>
            <View style={{ width: "72%" }}></View>
            <View style={{ width: "14%", alignItems: "center" }}>
                <TouchableOpacity style={styles.controlsHeaderButton}
                    onPress={handleManageFilters}
                >
                    <Ionicons name={"filter"} size={24} color={theme.colors.white} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    controlsHeader: { position: "absolute", top: 0, padding: 10, width: "100%",
        paddingTop: 30, flexDirection: "row-reverse" },
    controlsHeaderButton: { padding: 6, borderRadius: 10, margin: 4,
        backgroundColor: theme.colors.blueOpacity },
})

export default VideoHeader
