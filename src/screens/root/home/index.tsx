import { StyleSheet, View, ScrollView, RefreshControl } from "react-native"
import { ActionHeader, SectionHeader } from "@components/general/section/headers"
import AlertBox, { alertMessage } from "@components/general/AlertBox"
import { Purchase, Sales, Wallet } from "@src/services/memory/types"
import { UpdateUserProfile } from "@src/services/userManager"
import { getWallets } from "@src/services/memory/wallets"
import { useTranslate } from "@src/services/translate"
import { useAuth } from "@src/providers/userProvider"
import { WalletList } from "@components/wallet"
import { useEffect, useState } from "react"
import { HeaderHome } from "../headers"
import theme from "@src/theme"
import { FriendList } from "@/src/components/nostr"

const HomeScreen = ({ navigation }: any) => {

    const { user, setUser } = useAuth()
    const [loading, setLoading] = useState(true)
    const [sales, setSales] = useState<Sales[]>()
    const [purchases, setPurchases] = useState<Purchase[]>()
    const [wallets, setWallets] = useState<Wallet[]>([])

    useEffect(() => {

        handleData()

    }, [])

    // search for SafeAreaView to scoll horizontal wallets

    const handleData = async () => {
        setLoading(true)

        const wallets = await getWallets()
        // const purchases = await getPurchase()
        // const sales = await getSales()

        setWallets(wallets)

        // setPurchases(purchases)
        // setSales(sales)

        // await UpdateUserProfile({ user: user ?? {}, setUser })

        setLoading(false)

        if (wallets.length <= 0)
            alertMessage(useTranslate("message.wallet.alertcreate"))
    }

    const actionWallet: ActionHeader = {
        icon: "add", action: () => navigation.navigate("add-wallet-stack")
    }

    return (
        <View style={styles.container}>
            <HeaderHome navigation={navigation} />
            <ScrollView
                contentContainerStyle={theme.styles.scroll_container}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={handleData} />}
            >
                {/* Wallets */}
                <SectionHeader icon="wallet" label={useTranslate("section.title.wallets")} actions={[actionWallet]} />

                {/* Wallets section  */}
                <WalletList wallets={wallets} navigation={navigation} />

                {/* Sales and Shopping */}
                <SectionHeader icon="cash-outline" label={useTranslate("section.title.sales")} />

                <FriendList searchTerm="" onPressFollow={user => console.log(user)} />
                {/* Wallets section  */}
                {/* <WalletList  wallets={wallets} /> */}

            </ScrollView>
            <AlertBox />
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        padding: 10,
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.colors.gray,
    },
    container: {
        backgroundColor: theme.colors.black,
        height: "100%"
    },
})

export default HomeScreen