import { RefreshControl, ScrollView, StyleSheet, View, } from "react-native"
import { ActionHeader, SectionHeader } from "@components/general/section/headers"
import { useTranslateService } from "@src/providers/translateProvider"
import { useAuth } from "@src/providers/userProvider"
import WalletList from "@components/wallet/WalletList"
import { useEffect, useState } from "react"
import { HeaderHome } from "./header"
import theme from "@src/theme"
import { pushMessage } from "@src/services/notification"
import { walletService } from "@/src/core/walletManager"

const HomeScreen = ({ navigation }: any) => {

    const { wallets, setWallets } = useAuth()
    const { useTranslate } = useTranslateService()
    const [loading, setLoading] = useState(false)

    useEffect(() => { handleData() }, [])

    const handleData = async () => {
        setLoading(true)

        if(setWallets) setWallets(await walletService.list())

        if (wallets.length <= 0)
            pushMessage(useTranslate("message.wallet.alertcreate"))

        setLoading(false)
    }

    const actionWallet: ActionHeader = {
        icon: "add", action: () => navigation.navigate("add-wallet-stack")
    }

    return (
        <View style={styles.container}>
            <HeaderHome navigation={navigation} />
            <ScrollView
                contentContainerStyle={[theme.styles.scroll_container, {}]}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={handleData} />}
            >
                {/* Wallets */}
                <SectionHeader icon="wallet" label={useTranslate("section.title.wallets")} actions={[actionWallet]} />

                {/* Wallets section  */}
                <WalletList wallets={wallets} navigation={navigation} />

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
