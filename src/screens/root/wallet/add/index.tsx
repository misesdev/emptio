
import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import { ButtonLink, ButtonPrimary } from "@components/form/Buttons"
import Ionicons from 'react-native-vector-icons/Ionicons'
import SplashScreen from "@components/general/SplashScreen"
import { walletService } from "@src/core/walletManager"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { FormControl } from "@components/form/FormControl"
import { pushMessage } from "@services/notification"
import { useAuth } from "@src/providers/userProvider"
import { userService } from "@src/core/userManager"
import { useTranslateService } from "@src/providers/translateProvider"
import { WalletType } from "@services/memory/types"
import { getWallets } from "@services/memory/wallets"
import { BaseWallet } from "@services/bitcoin"
import { useEffect, useState } from "react"
import { StackScreenProps } from "@react-navigation/stack"
import theme from "@src/theme"
import { ScrollView } from "react-native-gesture-handler"


const AddWalletScreen = ({ navigation }: StackScreenProps<any>) => {

    const { user, wallets, setWallets } = useAuth()
    const { useTranslate } = useTranslateService()
    const [loading, setLoading] = useState(false)
    const [disabled, setDisabled] = useState(true)
    const [walletName, setWalletName] = useState<string>("")
    const [walletPassword, setWalletPassword] = useState<string>("")
    const [walletType, setWalletType] = useState<WalletType>("bitcoin")

    useEffect(() => {
        navigation.setOptions({ 
            header: () => <HeaderScreen
                title={useTranslate("screen.title.addwallet")}
                onClose={() => navigation.goBack()}
            /> 
        })
    }, [])

    const handleWalletType = (type: WalletType) => {
        setWalletType(type)
    }

    const handleSetName = (value: string) => {
        setDisabled(value.length <= 5)
        setWalletName(value)
    }

    const handleCreate = async () => {
        if (!walletName || walletName.length <= 5)
            return pushMessage(useTranslate("message.wallet.nameempty"))

        setLoading(true)

        setTimeout(async () => {
            const response = await walletService.create({ 
                name: walletName, 
                password: walletPassword, 
                type: walletType,
                wallets 
            })
            
            if (response.success)
            {
                let base = response.data as BaseWallet
                if (base.wallet.default) {
                    user.default_wallet = base.wallet.key
                    user.bitcoin_address = base.wallet.address
                    await userService.updateProfile({ user, upNostr: true })
                }

                if(setWallets) setWallets(await getWallets())

                navigation.navigate("seed-wallet-stack", { 
                    origin: "create", 
                    wallet: base.wallet,
                    mnemonic: base.mnemonic.split(" ")
                })
            }
            else if(response.message) {
                pushMessage(response.message)
            }

            setLoading(false)
        }, 20)
    }

    const handleImportWallet = () => {
        const type: WalletType = walletType 
        
        navigation.navigate("import-wallet-stack", { type })
    }

    if (loading)
        return <SplashScreen />

    return (
        <ScrollView contentContainerStyle={theme.styles.container}>
            <View style={{ width: "100%" }}>
                <FormControl label={useTranslate("labels.wallet.name")} 
                    value={walletName} onChangeText={handleSetName} 
                />
                
                <FormControl label={useTranslate("labels.wallet.password")}
                    value={walletPassword} onChangeText={setWalletPassword} 
                />
            </View>

            <View style={{ width: "100%", alignItems: "center", marginVertical: 30 }}>
                <TouchableOpacity activeOpacity={.7}
                    style={[styles.selection, { borderWidth: walletType == "bitcoin" ? 1 : 0 }]}
                    onPress={() => handleWalletType("bitcoin")}
                >
                    <View style={{ width: "15%", height: "100%", alignItems: "center", justifyContent: "center" }}>
                        {/* <Image source={{ uri: "" }} style={{ }}/> */}
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
                    style={[styles.selection, { borderWidth: walletType == "testnet" ? 1 : 0 }]}
                    onPress={() => handleWalletType("testnet")}
                >
                    <View style={{ width: "15%", height: "100%", alignItems: "center", justifyContent: "center" }}>
                        {/* <Image source={{ uri: "" }} style={{ }}/> */}
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

                {/* <TouchableOpacity activeOpacity={1} disabled */}
                {/*     style={[styles.selection, { borderWidth: walletType == "lightning" ? 2 : 0, backgroundColor: theme.colors.section }]} */}
                {/*     onPress={() => { handleWalletType("lightning") }} */}
                {/* > */}
                {/*     <View style={{ width: "15%", height: "100%", alignItems: "center", justifyContent: "center" }}> */}
                      {/* <Image source={{ uri: "" }} style={{ }}/> */}
                {/*         <Ionicons name="flash" size={theme.icons.large} color={theme.colors.yellow} /> */}
                {/*     </View> */}
                {/*     <View style={{ width: "85%" }}> */}
                {/*         <Text style={[styles.typeTitle, { color: theme.colors.white }]}> */}
                {/*             {useTranslate("wallet.lightning.tag")} */}
                {/*         </Text> */}
                {/*         <Text style={styles.typeDescription}> */}
                {/*             {useTranslate("wallet.lightning.description")} */}
                {/*         </Text> */}
                {/*     </View> */}
                {/* </TouchableOpacity> */}
            </View>

            {/* Import wallet from seed phrase */}

            <ButtonLink label={useTranslate("commons.import")} onPress={handleImportWallet} color={theme.colors.gray} />

            <View style={styles.buttonArea}>
                <ButtonPrimary label={useTranslate("commons.create")} 
                    onPress={() => handleCreate()} disabled={disabled}
                    style={{ backgroundColor: disabled ? 
                        theme.colors.disabled : theme.colors.blue }}
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    title: { top: 50, fontSize: 22, fontWeight: 'bold', position: "absolute", 
        color: theme.colors.white },
    selection: { width: "90%", minHeight: 20, maxHeight: 100, borderRadius: 10, 
        marginVertical: 10, flexDirection: "row", borderColor: theme.colors.white },
    typeTitle: { fontSize: 16, fontWeight: "bold", marginTop: 15, color: theme.colors.white },
    typeDescription: { marginBottom: 15, color: theme.colors.gray },
    buttonArea: { width: '100%', position: 'absolute', justifyContent: 'center', 
        marginBottom: 25, flexDirection: "row", bottom: 10 }
})

export default AddWalletScreen
