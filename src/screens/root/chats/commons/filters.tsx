import { TouchableOpacity, Text, StyleSheet } from "react-native"
import theme from "@src/theme"
import { ScrollView } from "react-native-gesture-handler"
import { useTranslateService } from "@/src/providers/translateProvider"

export type ChatFilterType = "friends" | "unknown" | "all" | "unread"

type Props = {
    activeSection: ChatFilterType,
    onFilter: (type: ChatFilterType) => void
}

const ChatFilters = ({ onFilter, activeSection }: Props) => {
   
    const { useTranslate } = useTranslateService()

    const getSectionBackground = (section: ChatFilterType) => {
        if(activeSection == section) return theme.colors.blue
        return theme.colors.default
    }

    return (
        <ScrollView horizontal 
            style={styles.container}
            contentContainerStyle={{ flexDirection: "row-reverse" }}
        >
            <TouchableOpacity
                style={[styles.section, { backgroundColor: getSectionBackground("unknown") }]}
                onPress={() => onFilter("unknown")}
            >
                <Text style={styles.sectionLabel}>{useTranslate("chat.unknown")}</Text>
            </TouchableOpacity> 
            <TouchableOpacity
                style={[styles.section, { backgroundColor: getSectionBackground("friends") }]}
                onPress={() => onFilter("friends")}
            >
                <Text style={styles.sectionLabel}>{useTranslate("labels.friends")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.section, { backgroundColor: getSectionBackground("unread") }]}
                onPress={() => onFilter("unread")}
            >
                <Text style={styles.sectionLabel}>{useTranslate("chat.unread")}</Text>
            </TouchableOpacity>
             <TouchableOpacity
                style={[styles.section, { backgroundColor: getSectionBackground("all") }]}
                onPress={() => onFilter("all")}
            >
                <Text style={styles.sectionLabel}>{useTranslate("labels.all")}</Text>
            </TouchableOpacity>               
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { width: "100%", paddingHorizontal: 14, maxHeight: 42, 
        backgroundColor: theme.colors.semitransparent },
    section: { paddingHorizontal: 12, padding: 6, minWidth: 60, margin: 5, borderRadius: 10 },
    sectionLabel: { textAlign: "center", color: theme.colors.white }
})

export default ChatFilters
