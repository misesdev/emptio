import { StyleSheet, Text, View, ScrollView, RefreshControl } from "react-native"
import theme from "@src/theme"
import { useEffect, useState } from "react"
import SplashScreen from "@components/general/SplashScreen"
import { UpdateUserProfile } from "@src/services/userManager"
import { ActionHeader, SectionHeader } from "@components/general/section/headers"
import { Purchase, Sales, Wallet } from "@src/services/memory/types"
import { getWallets } from "@src/services/memory"
import { WalletList } from "@src/components/wallet"
import { useTranslate } from "@src/services/translate"

const Home = ({ navigation }: any) => {

    const [loading, setLoading] = useState(true)
    const [sales, setSales] = useState<Sales[]>()
    const [purchases, setPurchases] = useState<Purchase[]>()
    const [wallets, setWallets] = useState<Wallet[]>()

    useEffect(() => {

        handleData()
        
    }, [])

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
    }

    const actionWallet: ActionHeader = {
        icon: "add", action: () => navigation.navigate("add-wallet-stack")
    }

    if (loading)
        return <SplashScreen />

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={theme.styles.scroll_container}
                refreshControl={<RefreshControl refreshing={false} onRefresh={handleData} />}
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