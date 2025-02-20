import { TouchableOpacity, Text, StyleSheet, ScrollView } from "react-native"
import { useTranslateService } from "@src/providers/translateProvider"
import theme from "@src/theme"

export type ChatFilterType = "friends" | "unknown" | "all" | "unread" | "markread"

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

    interface OptionProps {
        label: string, 
        section: ChatFilterType,
        handleFilter: (section: ChatFilterType) => void
    }
    const OptionFilter = ({ label, section, handleFilter }: OptionProps) => {
        return (
            <TouchableOpacity
                style={[styles.section, { backgroundColor: getSectionBackground(section) }]}
                onPress={() => handleFilter(section)}
            >
                <Text style={styles.sectionLabel}>{label}</Text>
            </TouchableOpacity> 
        )
    }

    return (
        <ScrollView horizontal 
            style={styles.container}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10, flexDirection: "row-reverse" }}
        >
            {/* <OptionFilter section="markread" label={useTranslate("chat.action.markread")} /> */}
            <OptionFilter section="unknown" handleFilter={onFilter}
                label={useTranslate("chat.unknown")}
            />
            <OptionFilter section="friends" handleFilter={onFilter}
                label={useTranslate("labels.friends")} 
            />
            <OptionFilter section="unread" handleFilter={onFilter}
                label={useTranslate("chat.unread")} 
            />
            <OptionFilter section="all" handleFilter={onFilter}
                label={useTranslate("labels.all")}
            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { width: "100%", maxHeight: 42, backgroundColor: theme.colors.semitransparent },
    section: { paddingHorizontal: 12, padding: 6, minWidth: 60, margin: 5, borderRadius: 10 },
    sectionLabel: { textAlign: "center", fontWeight: "500", color: theme.colors.white }
})

export default ChatFilters
