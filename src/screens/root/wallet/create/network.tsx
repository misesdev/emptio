import { ButtonPrimary } from "@components/form/Buttons"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { useTranslateService } from "@src/providers/translateProvider"
import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import { useAuth } from "@src/providers/userProvider"
import { walletService } from "@services/wallet"
import { userService } from "@services/user"
import { BaseWallet } from "@services/bitcoin"
import { pushMessage } from "@services/notification"
import { storageService } from "@services/memory"
import { BNetwork } from "bitcoin-tx-lib"
import { useState } from "react"
import theme from "@src/theme"
import { ScrollView } from "react-native-gesture-handler"

const CreateWalletNetwork = ({ navigation, route }: any) => {

    const { user, setWallets } = useAuth()
    const { name, password } = route.params
    const [network, setNetwork] = useState<BNetwork>("mainnet")
    const [disabled, setDisabled] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const { useTranslate } = useTranslateService()

    const createWallet = async () => {
        setLoading(true)
        setDisabled(true)

        const response = await walletService.create({ name, password, network })
        
        if (response.success)
        {
            let base = response.data as BaseWallet
            if (base.wallet.default) {
                user.default_wallet = base.wallet.key
                user.bitcoin_address = base.wallet.address
                await userService.updateProfile({ user, upNostr: true })
            }

            if(setWallets) setWallets(await storageService.wallets.list())

            navigation.navigate("seed-wallet", { 
                wallet: base.wallet,
                mnemonic: base.mnemonic.split(" ")
            })
        }
        else if(response.message) {
            pushMessage(response.message)
        }

        setLoading(false)
        setDisabled(false)
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
                    onPress={createWallet}
                    label={useTranslate("commons.create")} 
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

export default CreateWalletNetwork
