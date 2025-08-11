import theme from "@src/theme"
import { BNetwork } from "bitcoin-tx-lib"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"

type NetworkOptionProps = {
    title: string;
    description: string;
    network: BNetwork;
    networkOption: BNetwork;
    chageNetwork: (n: BNetwork) => void;
}

const NetworkOption = ({
    title, description, networkOption, network, chageNetwork 
}: NetworkOptionProps) => {
    const iconColor = networkOption=="mainnet" ? theme.colors.orange : theme.colors.green;
    const borderColor = networkOption==network ? theme.colors.white : theme.colors.transparent; 
    return (
        <View style={styles.optionContent} >
            <TouchableOpacity activeOpacity={.7}
                style={[styles.option, { borderColor }]}
                onPress={() => chageNetwork(networkOption)}
            >
                <View style={{ width: "15%", height: "100%", alignItems: "center", justifyContent: "center" }}>
                    <Ionicons name="logo-bitcoin" size={theme.icons.large} color={iconColor} />
                </View>
                <View style={{ width: "85%" }}>
                    <Text style={[styles.title, { color: theme.colors.white }]}>
                        {title}
                    </Text>
                    <Text style={styles.description}>
                        {description}
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    optionContent: { width: "100%", padding: 10 },
    option: { width: "100%", minHeight: 20, maxHeight: 180, borderWidth: 1, padding: 5, flexDirection: "row",
        borderRadius: theme.design.borderRadius, backgroundColor: theme.colors.matteBlack },
    optionIcon: { width: "15%", height: "100%", alignItems: "center", justifyContent: "center" },
    title: { fontSize: 16, fontWeight: "bold", marginTop: 15, color: theme.colors.white },
    description: { marginBottom: 15, color: theme.colors.gray }
})

export default NetworkOption
