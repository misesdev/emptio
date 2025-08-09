import { ButtonPrimary } from "@components/form/Buttons"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { useTranslateService } from "@src/providers/TranslateProvider"
import { useService } from "@src/providers/ServiceProvider"
import Ionicons from "react-native-vector-icons/Ionicons"
import { BNetwork } from "bitcoin-tx-lib"
import { useState } from "react"
import theme from "@src/theme"

const WalletNetwork = ({ navigation, route }: any) => {

    const { name } = route.params
    const [network, setNetwork] = useState<BNetwork>("mainnet")
    const [disabled, setDisabled] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const { useTranslate } = useTranslateService()
    const { walletFactory } = useService()

    const continueToPassPhrase = async () => {
        setLoading(true)
        setDisabled(true)
        const mnemonic = walletFactory.generateMnemonic()
        navigation.navigate("create-wallet-mnemonic", { 
            name, 
            network, 
            mnemonic 
        })
        // const response = await walletService.create({ name, password, network })
        // 
        // if (response.success)
        // {
        //     let base = response.data as BaseWallet
        //     if (base.wallet.default) {
        //         user.default_wallet = base.wallet.key
        //         user.bitcoin_address = base.wallet.address
        //         await userService.updateProfile({ user, upNostr: true })
        //     }

        //     if(setWallets) setWallets(await storageService.wallets.list())

        //     navigation.navigate("seed-wallet", { 
        //         wallet: base.wallet,
        //         mnemonic: base.mnemonic.split(" ")
        //     })
        // }
        // else if(response.message) {
        //     pushMessage(response.message)
        // }

        setDisabled(false)
        setLoading(false)
    }

    return (
        <ScrollView contentContainerStyle={theme.styles.container}>
            <HeaderScreen 
                style={{ position: "absolute", top: 5 }}
                title={useTranslate("screen.title.addwallet")}
                onClose={() => navigation.goBack()}
            />

            <View style={{ height: 20 }}></View>

            <Text style={styles.title}>Defina a rede da carteira?</Text>
           
            <View style={{ width: "100%", alignItems: "center", marginVertical: 30 }}>
                <TouchableOpacity activeOpacity={.7}
                    style={[styles.selection, { borderColor: network == "mainnet" ? 
                        theme.colors.white : theme.colors.transparent }]}
                    onPress={() => setNetwork("mainnet")}
                >
                    <View style={{ width: "15%", height: "100%", alignItems: "center", justifyContent: "center" }}>
                        <Ionicons name="logo-bitcoin" size={theme.icons.large} color={theme.colors.orange} />
                    </View>
                    <View style={{ width: "85%" }}>
                        <Text style={[styles.typeTitle, { color: theme.colors.white }]}>
                            {useTranslate("wallet.bitcoin.tag")}
                        </Text>
                        <Text style={styles.typeDescription}>
                            {useTranslate("wallet.bitcoin.description")}
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={.7}
                    style={[styles.selection, { borderColor: network == "testnet" ? 
                        theme.colors.white : theme.colors.transparent }
                    ]}
                    onPress={() => setNetwork("testnet")}
                >
                    <View style={{ width: "15%", height: "100%", alignItems: "center", justifyContent: "center" }}>
                        <Ionicons name="logo-bitcoin" size={theme.icons.large} color={theme.colors.green} />
                    </View>
                    <View style={{ width: "85%" }}>
                        <Text style={[styles.typeTitle, { color: theme.colors.white }]}>
                            {useTranslate("wallet.bitcoin.testnet.tag")}
                        </Text>
                        <Text style={styles.typeDescription}>
                            {useTranslate("wallet.bitcoin.testnet.description")}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
            
            <View style={styles.buttonArea}>
                <ButtonPrimary
                    loading={loading}
                    disabled={disabled}
                    onPress={continueToPassPhrase}
                    label={useTranslate("commons.continue")} 
                />
            </View>
        </ScrollView>    
    )
}

const styles = StyleSheet.create({
    title: { fontSize: 25, fontWeight: "bold", textAlign: "center", color: theme.colors.white, marginVertical: 20 },
    buttonArea: { width: '100%', justifyContent: 'center', marginVertical: 10, flexDirection: "row", marginTop: 50 },
    selection: { width: "90%", minHeight: 20, maxHeight: 100, borderRadius: 10, 
        marginVertical: 10, flexDirection: "row", borderWidth: 1 },
    typeTitle: { fontSize: 16, fontWeight: "bold", marginTop: 15, color: theme.colors.white },
    typeDescription: { marginBottom: 15, color: theme.colors.gray },
})

export default WalletNetwork
