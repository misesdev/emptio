import { SafeAreaView, ScrollView, TouchableOpacity, Image, View, Text, StyleSheet } from "react-native"
import { useTranslateService } from "@/src/providers/translateProvider"
import { Wallet } from "@src/services/memory/types"
import theme from "@src/theme"
import WalletListItem from "./WalletListItem"

type Props = {
    wallets: Wallet[],
    navigation: any
}

const WalletList = ({ wallets, navigation }: Props) => {

    const { useTranslate } = useTranslateService()

    const handleOpenWallet = (wallet: Wallet) => {
        navigation.navigate("wallet-stack", { wallet })
    }

    return (
        <SafeAreaView style={{ width: "100%", height: 220 }}>
            <ScrollView horizontal>
                {wallets &&
                    wallets.map((wallet) => <WalletListItem key={wallet.key} wallet={wallet} handleOpen={handleOpenWallet} />)
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
