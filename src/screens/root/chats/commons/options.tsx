import { TouchableOpacity, Text, StyleSheet } from "react-native"
import theme from "@src/theme"
import { ScrollView } from "react-native-gesture-handler"
import { useTranslateService } from "@/src/providers/translateProvider"

export type ChatActionType = "delete" | "markread" | "cancel" 

type Props = {
    onAction: (type: ChatActionType) => void
}

const ChatGroupAction = ({ onAction }: Props) => {
    
    const { useTranslate } = useTranslateService()

    return (
        <ScrollView horizontal 
            style={styles.container}
            contentContainerStyle={{ flexDirection: "row-reverse" }}
        >
            <TouchableOpacity
                style={styles.section}
                onPress={() => onAction("cancel")}
            >
                <Text style={styles.sectionLabel}>{useTranslate("commons.cancel")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.section}
                onPress={() => onAction("markread")}
            >
                <Text style={styles.sectionLabel}>{useTranslate("chat.action.markread")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.section}
                onPress={() => onAction("delete")}
            >
                <Text style={styles.sectionLabel}>{useTranslate("commons.delete")}</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { width: "100%", paddingHorizontal: 14, 
        maxHeight: 42, backgroundColor: theme.colors.semitransparent },
    section: { paddingHorizontal: 12, padding: 6, minWidth: 60, margin: 5, 
        borderRadius: 10, backgroundColor: theme.colors.blue },
    sectionLabel: { textAlign: "center", color: theme.colors.white }
})

export default ChatGroupAction
