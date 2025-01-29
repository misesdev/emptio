import { TouchableOpacity, View, Text, StyleSheet } from "react-native"
import theme from "@src/theme"

export type ChatFilterType = "friends" | "request" | "all"

type Props = {
    activeSection: ChatFilterType,
    onFilter: (type: ChatFilterType) => void
}

const ChatFilters = ({ onFilter, activeSection }: Props) => {
    
    const getSectionBackground = (section: ChatFilterType) => {
        if(activeSection == section) return theme.colors.blue
        return theme.colors.default
    }

    return (
        <View style={styles.container}>
             <TouchableOpacity
                style={[styles.section, { backgroundColor: getSectionBackground("all") }]}
                onPress={() => onFilter("all")}
            >
                <Text style={styles.sectionLabel}>All</Text>
            </TouchableOpacity>               
            <TouchableOpacity
                style={[styles.section, { backgroundColor: getSectionBackground("request") }]}
                onPress={() => onFilter("request")}
            >
                <Text style={styles.sectionLabel}>Requests</Text>
            </TouchableOpacity> 
            <TouchableOpacity
                style={[styles.section, { backgroundColor: getSectionBackground("friends") }]}
                onPress={() => onFilter("friends")}
            >
                <Text style={styles.sectionLabel}>Friends</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flexDirection: "row-reverse", width: "100%", paddingHorizontal: 14, backgroundColor: theme.colors.semitransparent },
    section: { paddingHorizontal: 12, padding: 6, minWidth: 60, margin: 5, borderRadius: 10 },
    sectionLabel: { textAlign: "center", color: theme.colors.white }
})

export default ChatFilters
