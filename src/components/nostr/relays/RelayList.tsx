import { View, FlatList, TouchableOpacity, StyleSheet, Text } from "react-native"
import { useCallback } from "react"
import theme from "@src/theme"
import { getClipedContent } from "@src/utils"
import { useTranslateService } from "@src/providers/translateProvider"

interface RelayItemProps {
    relay: string,
    onPressRelay: (relay: string) => void
}

export const RelayItem = ({ relay, onPressRelay }: RelayItemProps) => {
    return (
        <TouchableOpacity
            activeOpacity={.7}
            style={styles.sectionRelay}
            onPress={() => onPressRelay(relay)}
        >
            <View style={{ padding: 5 }}>
                <Text style={{ color: theme.colors.gray, fontSize: 16, fontWeight: "500" }}>
                    {getClipedContent(relay, 40)}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

interface Props {
    relays: string[],
    onPressRelay: (relay: string) => void
}

export const RelayList = ({ relays, onPressRelay }: Props) => {

    const { useTranslate } = useTranslateService()

    const renderItem = useCallback(({ item }: { item: string }) => {
        return <RelayItem relay={item} onPressRelay={onPressRelay} />
    }, [onPressRelay])

    const EmptyComponent = () => {
        return (
            <Text style={{ marginVertical: 50, textAlign: "center", color: theme.colors.gray }}>
                {useTranslate("message.relay.empty")}
            </Text>
        )
    }

    return (
        <View style={{ flex: 1, padding: 10 }}>
            <FlatList 
                data={relays}
                renderItem={renderItem}
                ListEmptyComponent={EmptyComponent}
                style={{ flex: 1 }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    sectionRelay: { width: "100%", borderRadius: 10, marginVertical: 2, flexDirection: "row",
        padding: 15, backgroundColor: "rgba(0, 55, 55, .2)" },
})
