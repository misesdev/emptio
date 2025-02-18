import { RefreshControl, ScrollView, StyleSheet, Vibration, View, } from "react-native"
import { ActionHeader, SectionHeader } from "@components/general/section/headers"
import { useTranslateService } from "@src/providers/translateProvider"
import { useAuth } from "@src/providers/userProvider"
import WalletList from "@components/wallet/WalletList"
import { useEffect, useState } from "react"
import { pushMessage } from "@services/notification"
import { walletService } from "@src/core/walletManager"
import { HeaderHome } from "./header"
import { StackScreenProps } from "@react-navigation/stack"
import theme from "@src/theme"

const HomeScreen = ({ navigation }: StackScreenProps<any>) => {

    const { wallets, setWallets } = useAuth()
    const { useTranslate } = useTranslateService()
    const [loading, setLoading] = useState(false)
    const [reloadWallets, setReloadWallets] = useState<boolean>(true)                                                               

    useEffect(() => { 
        navigation.setOptions({ header: () => <HeaderHome navigation={navigation} /> })
        setTimeout(async () => handleData(), 20) 
    }, [])

    const handleData = async () => {
        setLoading(true)
        if(wallets.length) Vibration.vibrate(45)

        if(setWallets) setWallets(await walletService.list())

        if (wallets.length <= 0)
            pushMessage(useTranslate("message.wallet.alertcreate"))

        setReloadWallets(!reloadWallets)

        setLoading(false)
    }

    const actionWallet: ActionHeader = {
        icon: "add", action: () => navigation.navigate("add-wallet-stack")
    }

    return (
        <View style={styles.container}>            
            <ScrollView
                contentContainerStyle={[theme.styles.scroll_container, {}]}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={handleData} />}
            >
                {/* Wallets */}
                <SectionHeader icon="wallet" label={useTranslate("section.title.wallets")} actions={[actionWallet]} />

                {/* Wallets section  */}
                <WalletList reload={reloadWallets} wallets={wallets} navigation={navigation} />

                {/* Sales and Shopping section*/}
                <SectionHeader icon="cash-outline" label={useTranslate("section.title.sales")} />

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.black,
        height: "100%"
    },
})

export default HomeScreen
