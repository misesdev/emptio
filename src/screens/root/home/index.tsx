import { RefreshControl, ScrollView, StyleSheet, View, } from "react-native"
import { ActionHeader, SectionHeader } from "@components/general/section/headers"
import AlertBox, { alertMessage } from "@components/general/AlertBox"
import { FollowList } from "@components/nostr/follow/FollowList"
import { userService } from "@/src/core/userManager"
import { Wallet } from "@src/services/memory/types"
import { getWallets } from "@src/services/memory/wallets"
import { useTranslate } from "@src/services/translate"
import { useAuth } from "@src/providers/userProvider"
import WalletList from "@components/wallet/WalletList"
import { useEffect, useState } from "react"
import { HeaderHome } from "./header"
import theme from "@src/theme"

const HomeScreen = ({ navigation }: any) => {

    const { user, setUser } = useAuth()
    const [loading, setLoading] = useState(false)
    const [wallets, setWallets] = useState<Wallet[]>([])

    useEffect(() => { handleData() }, [])

    const handleData = async () => {
        setLoading(true)
        const wallets = await getWallets()

        if (wallets.length <= 0)
            alertMessage(useTranslate("message.wallet.alertcreate"))

        setWallets(wallets)

        await userService.updateProfile({ user: user ?? {}, setUser })
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

                {/* Sales and Shopping */}
                <SectionHeader icon="cash-outline" label={useTranslate("section.title.sales")} />

                <AlertBox />
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