import { TouchableOpacity, Text, StyleSheet } from "react-native"
import { useTranslateService } from "@src/providers/translateProvider"
import theme from "@src/theme"
import { useCallback, useEffect, useState } from "react"
import { FlatList } from "react-native-gesture-handler"

export type ChatFilterType = "friends" | "unknown" | "all" | "unread" | "markread"

type Props = {
    activeSection: ChatFilterType,
    onFilter: (type: ChatFilterType) => void
}

const ChatFilters = ({ onFilter, activeSection }: Props) => {
   
    const { useTranslate } = useTranslateService()
    const [filters, setFilters] = useState<ChatFilterType[]>([])
    const [sectionLabels, setSectionLabels] = useState<Map<ChatFilterType, string>>()
    
    useEffect(() => { 
        setFilters(["all", "unread", "friends", "unknown"])
        setSectionLabels(new Map<ChatFilterType, string>([
            ["unknown", useTranslate("chat.unknown")],
            ["unread", useTranslate("chat.unread")],
            ["friends", useTranslate("labels.friends")],
            ["all", useTranslate("labels.all")]
        ]))
    }, [useTranslate])

    interface OptionProps {
        label: string, 
        section: ChatFilterType,
        handleFilter: (section: ChatFilterType) => void
    }
    
    const OptionFilter = useCallback(({ label, section, handleFilter }: OptionProps) => {
        return (
            <TouchableOpacity onPress={() => handleFilter(section)}
                style={[styles.section, { 
                    backgroundColor: (activeSection == section) ? theme.colors.blue
                        : theme.colors.default
                }]}
            >
                <Text style={styles.sectionLabel}>{label}</Text>
            </TouchableOpacity> 
        )
    }, [activeSection])

    const renderItem = useCallback(({ item }: { item: ChatFilterType }) => {
        return <OptionFilter section={item}
            label={sectionLabels?.get(item)??""}  
            handleFilter={onFilter} 
        />
    }, [onFilter, sectionLabels, activeSection])

    return (
        <FlatList horizontal 
            data={filters}
            renderItem={renderItem}
            style={styles.container}
            contentContainerStyle={{ paddingHorizontal: 10 }}
        />
    )
}

const styles = StyleSheet.create({
    container: { width: "100%", maxHeight: 42, backgroundColor: theme.colors.semitransparent },
    section: { paddingHorizontal: 12, padding: 6, minWidth: 60, margin: 5, borderRadius: 10 },
    sectionLabel: { textAlign: "center", fontWeight: "500", color: theme.colors.white }
})

export default ChatFilters

