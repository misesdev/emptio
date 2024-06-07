import { SafeAreaView, ScrollView, TouchableOpacity, Image, View, Text, StyleSheet } from "react-native"
import { useTranslateService } from "@/src/providers/translateProvider"
import { formatSats, toBitcoin } from "@src/services/converter"
import { useAuth } from "@src/providers/userProvider"
import { Wallet } from "@src/services/memory/types"
import theme from "@src/theme"

type Props = {
    wallets: Wallet[],
    navigation: any
}

const WalletList = ({ wallets, navigation }: Props) => {

    const { setWallet } = useAuth()
    const { useTranslate } = useTranslateService()

    const handleOpenWallet = (wallet: Wallet) => {

        if (setWallet)
            setWallet(wallet)

        navigation.navigate("wallet-stack")
    }

    return (
        <SafeAreaView style={{ width: "100%", height: 220 }}>
            <ScrollView horizontal>
                {wallets &&
                    wallets.map((wallet, key) => {
                        let balanceSats = formatSats(wallet.lastBalance)
                        let balanceBTC = toBitcoin(wallet.lastBalance)
                        let typyWallet = wallet.type === "bitcoin" ? useTranslate("wallet.bitcoin.tag") : useTranslate("wallet.lightning.tag")
                        return (
                            <TouchableOpacity style={[styles.wallet, { paddingHorizontal: 5 }]} key={key} activeOpacity={1}>
                                {wallet!.type === "bitcoin" && <Image source={require("assets/images/bitcoin-wallet-header3.jpg")} style={{ position: "absolute", borderRadius: 18, width: "100%", height: "100%" }} />}
                                {wallet!.type === "lightning" && <Image source={require("assets/images/lightning-wallet-header.png")} style={{ position: "absolute", borderRadius: 18, width: "100%", height: "100%" }} />}
                                <View style={{ position: "absolute", width: "100%", height: "100%", borderRadius: 18, backgroundColor: "rgba(0,55,55,.7)" }}></View>

                                <Text style={styles.title}>{wallet.name}</Text>
                                <Text style={{ marginHorizontal: 10, marginVertical: 6, color: theme.colors.white, fontSize: 18, fontWeight: "bold" }}>{balanceSats} Sats</Text>
                                <Text style={[styles.description, { color: theme.colors.white }]}>{balanceBTC} BTC</Text>
                                <TouchableOpacity activeOpacity={.7} style={[styles.button, { backgroundColor: theme.colors.orange }]} onPress={() => handleOpenWallet(wallet)}>
                                    <Text style={styles.buttonText}> {useTranslate("commons.open")} </Text>
                                </TouchableOpacity>

                                <Text style={{
                                    backgroundColor: theme.colors.gray, color: theme.colors.white, margin: 10, borderRadius: 10,
                                    fontSize: 10, fontWeight: "bold", paddingHorizontal: 10, paddingVertical: 4, position: "absolute", top: -18, right: 14,
                                }}>{typyWallet}</Text>
                            </TouchableOpacity>
                        )
                    })
                }

                <View style={[styles.wallet, { backgroundColor: theme.colors.section, padding: 5 }]}>
                    <Text style={styles.title}>{useTranslate("labels.wallet.add")}</Text>
                    <Text style={[styles.description, { color: theme.colors.gray }]}>{useTranslate("message.wallet.create")}</Text>
                    <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.blue }]} activeOpacity={.7} onPress={() => navigation.navigate("add-wallet-stack")}>
                        <Text style={styles.buttonText}> {useTranslate("commons.add")} </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    wallet: { width: 360, marginVertical: 10, marginHorizontal: 6, borderRadius: 18 },
    title: { color: theme.colors.white, fontSize: 24, fontWeight: "bold", marginTop: 20, marginHorizontal: 10 },
    description: { fontSize: 12, marginHorizontal: 10, marginVertical: 6 },
    button: { margin: 10, maxWidth: 150, paddingVertical: 14, borderRadius: 15, },
    buttonText: { color: theme.colors.white, fontSize: 13, fontWeight: "bold", textAlign: 'center', marginHorizontal: 28 },
})

export default WalletList