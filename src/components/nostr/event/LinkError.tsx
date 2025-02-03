import { Linking, TouchableOpacity, View, Text, StyleSheet } from "react-native"
import theme from "@/src/theme"

type ScreenProps = { url: string }

const LinkError = ({ url }: ScreenProps) => {
    return (
        <TouchableOpacity activeOpacity={.7} onPress={() => Linking.openURL(url)} style={styles.webContainer}>
            <View style={styles.subSection}>
                <Text style={styles.description}>{url}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    webContainer: { width: "100%", padding: 4, borderRadius: 10, overflow: "hidden", 
        backgroundColor: theme.colors.blueOpacity },
    subSection: { width: "100%", padding: 6 },
    description: { textAlign: "center", color: theme.colors.gray, fontSize: 13 }
})

export default LinkError
