import { TouchableOpacity, StyleSheet } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import { ScrollView } from "react-native-gesture-handler"
import theme from "@src/theme"

export type MessageActionType = "delete" | "copy" | "cancel" 

type Props = {
    onAction: (type: MessageActionType) => void
}

const MessageGroupAction = ({ onAction }: Props) => {
    
    return (
        <ScrollView horizontal 
            style={styles.container}
            contentContainerStyle={{ minHeight: 50, flexDirection: "row-reverse" }}
        >
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
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { width: "100%", paddingHorizontal: 14, flexDirection: "row-reverse", 
        maxHeight: 50, backgroundColor: theme.colors.semitransparent },
    section: { paddingHorizontal: 12, padding: 6, margin: 5, 
        borderRadius: 10, backgroundColor: theme.colors.transparent },
})

export default MessageGroupAction
