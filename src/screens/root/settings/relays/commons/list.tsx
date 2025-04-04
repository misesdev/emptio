import { NDKRelay } from "@nostr-dev-kit/ndk-mobile"
import { getClipedContent } from "@src/utils"
import { StyleSheet, TouchableOpacity, View, Text } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import theme from "@src/theme"

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
                    {getClipedContent(relay.url.slice(0,-1), 28)}{" "}
                    <Ionicons name="ellipse" 
                        size={10} color={relay.connected ? theme.colors.green : theme.colors.gray } 
                    />
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
            {relays.map((relay) => {
                return <RelayItem key={relay.url} onPress={onPressRelay} relay={relay} />
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
