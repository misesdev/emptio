import theme from "@src/theme"
import { getClipedContent } from "@src/utils"
import { FlatList, StyleSheet, TouchableOpacity, View, Text } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"

interface RelayProps {
    relay: string,
    onPress: (relay: string) => void
}

const RelayItem = ({ relay, onPress }: RelayProps) => {
    return (
        <TouchableOpacity
            activeOpacity={.7} 
            style={styles.sectionRelay}
            onPress={() => onPress(relay)}
        >
            <View style={styles.relayArea}>
                <Text style={{ color: theme.colors.gray, fontWeight: "500" }}>
                    {getClipedContent(relay, 28)}
                </Text>
            </View>
            <View style={styles.onlineArea}>
                <Ionicons name="arrow-forward" size={18} color={theme.colors.blue} /> 
            </View>
        </TouchableOpacity> 
    )
}

interface Props {
    relays: string[],
    onPressRelay: (relay: string) => void
}

export const RelayList = ({ relays, onPressRelay }: Props) => {

    const renderItem = ({ item }: { item: string }) => {
        return <RelayItem onPress={onPressRelay} relay={item} />
    }

    return (
        <FlatList 
            data={relays} 
            renderItem={renderItem}
            scrollEnabled={false}
        />
    )
}

const styles = StyleSheet.create({
    sectionRelay: { width: "98%", minHeight: 65, maxHeight: 120, borderRadius: 10,
        marginVertical: 1, flexDirection: "row", backgroundColor: "rgba(0, 55, 55, .2)" },
    relayArea: { width: "80%", justifyContent: "center", paddingHorizontal: 20 },
    onlineArea: { width: "20%", justifyContent: "center", alignItems: "center" },
})
