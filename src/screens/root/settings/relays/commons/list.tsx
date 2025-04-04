import { NDKRelay } from "@nostr-dev-kit/ndk-mobile"
import theme from "@src/theme"
import { getClipedContent } from "@src/utils"
import { StyleSheet, TouchableOpacity, View, Text } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"

interface RelayProps {
    relay: NDKRelay,
    onPress: (relay: NDKRelay) => void
}

const RelayItem = ({ relay, onPress }: RelayProps) => {

    return (
        <TouchableOpacity
            activeOpacity={.7} 
            style={styles.sectionRelay}
            onPress={() => onPress(relay)}
        >
            <View style={styles.relayArea}>
                <Text style={{ color: theme.colors.gray, fontWeight: "400" }}>
                    {getClipedContent(relay.url.slice(0,-1), 28)}
                </Text>
            </View>
            <View style={styles.onlineArea}>
                <Ionicons name="chevron-forward" size={18} color={theme.colors.gray} /> 
            </View>
        </TouchableOpacity> 
    )
}

interface Props {
    relays: NDKRelay[],
    onPressRelay: (relay: NDKRelay) => void
}

export const RelayList = ({ relays, onPressRelay }: Props) => {
    return (
        <View style={styles.container}>
            {relays.map((relay, key) => {
                return <RelayItem key={key} onPress={onPressRelay} relay={relay} />
            })}
        </View>       
    )
}

const styles = StyleSheet.create({
    container: { width: "100%", padding: 10 },
    sectionRelay: { width: "100%", minHeight: 65, maxHeight: 120, borderRadius: 10,
        marginVertical: 1, flexDirection: "row", backgroundColor: "rgba(0, 55, 55, .2)" },
    relayArea: { width: "80%", justifyContent: "center", paddingHorizontal: 20 },
    onlineArea: { width: "20%", justifyContent: "center", alignItems: "center" },
})
