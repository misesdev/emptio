import { StyleSheet, Text, View, ScrollView, RefreshControl } from "react-native"
import theme from "@src/theme"
import { useEffect, useState } from "react"
import { UpdateUserProfile } from "@src/services/userManager"
import { ActionHeader, SectionHeader } from "@components/general/section/headers"
import { Purchase, Sales, Wallet } from "@src/services/memory/types"
import { getWallets } from "@src/services/memory"
import { WalletList } from "@components/wallet"
import { useTranslate } from "@src/services/translate"
import AlertBox, { alertMessage } from "@components/general/AlertBox"

const Home = ({ navigation }: any) => {

    const [loading, setLoading] = useState(true)
    const [sales, setSales] = useState<Sales[]>()
    const [purchases, setPurchases] = useState<Purchase[]>()
    const [wallets, setWallets] = useState<Wallet[]>()

    useEffect(() => {

        handleData()

    }, [])

    // search for SafeAreaView to scoll horizontal wallets

    const handleData = async () => {
        setLoading(true)

        await UpdateUserProfile()

        const wallets = await getWallets()
        // const purchases = await getPurchase()
        // const sales = await getSales()

        setWallets(wallets)
        // setPurchases(purchases)
        // setSales(sales)

        setLoading(false)

        if (wallets.length <= 0)
            alertMessage("add a wallet to buy or sell bitcoin!")
    }

    const actionWallet: ActionHeader = {
        icon: "add", action: () => navigation.navigate("add-wallet-stack")
    }

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={theme.styles.scroll_container}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={handleData} />}
            >
                {/* Wallets */}
                <SectionHeader icon="wallet" label={useTranslate("section.title.wallets")} actions={[actionWallet]} />

                {/* Wallets section  */}
                <WalletList wallets={wallets} action={() => navigation.navigate("add-wallet-stack")} />

                {/* Sales and Shopping */}
                <SectionHeader icon="cash-outline" label={useTranslate("section.title.sales")} />

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

export default Home