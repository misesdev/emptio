import { TouchableOpacity, StyleSheet, ScrollView, View } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import theme from "@src/theme"

export type MessageActionType = "delete" | "copy" | "cancel" | "foward" 

type Props = {
    onAction: (type: MessageActionType) => void
}

const MessageGroupAction = ({ onAction }: Props) => {
    
    return (
        <ScrollView horizontal style={styles.container}>
            <View style={styles.containerRow}>
                <TouchableOpacity
                    style={styles.section}
                    onPress={() => onAction("cancel")}
                >
                    <Ionicons name="arrow-undo" size={20} color={theme.colors.white}/>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.section}
                    onPress={() => onAction("copy")}
                >
                    <Ionicons name="copy" size={20} color={theme.colors.white}/>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.section}
                    onPress={() => onAction("delete")}
                >
                    <Ionicons name="trash" size={20} color={theme.colors.white}/>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.section}
                    onPress={() => onAction("foward")}
                >
                    <Ionicons name="arrow-redo" size={20} color={theme.colors.white}/>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { width: "100%", backgroundColor: theme.colors.semitransparent,
        minHeight: 50, flexDirection: "row-reverse" },
    containerRow: { width: "100%", padding: 6, flexDirection: "row-reverse" },
    section: { padding: 6, marginHorizontal: 5, borderRadius: 10, paddingHorizontal: 14,
        backgroundColor: theme.colors.section },
})

export default MessageGroupAction
