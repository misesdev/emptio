import { TouchableOpacity, StyleSheet } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import { ScrollView } from "react-native-gesture-handler"
import theme from "@src/theme"

export type ChatActionType = "delete" | "markread" | "cancel" 

type Props = {
    onAction: (type: ChatActionType) => void
}

const ChatGroupAction = ({ onAction }: Props) => {
    
    return (
        <ScrollView horizontal 
            style={styles.container}
            contentContainerStyle={{ flexDirection: "row-reverse" }}
        >
            <TouchableOpacity
                style={styles.section}
                onPress={() => onAction("cancel")}
            >
                <Ionicons name="arrow-undo" size={20} color={theme.colors.white}/>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.section}
                onPress={() => onAction("markread")}
            >
                <Ionicons name="mail-open" size={20} color={theme.colors.white}/>
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
        maxHeight: 42, backgroundColor: theme.colors.semitransparent },
    section: { paddingHorizontal: 12, padding: 6, margin: 5, borderRadius: 10, 
        backgroundColor: theme.colors.section },
})

export default ChatGroupAction
