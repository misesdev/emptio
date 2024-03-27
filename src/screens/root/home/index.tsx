import { StyleSheet, Text, View, ScrollView, RefreshControl } from "react-native"
import theme from "@src/theme"
import { useEffect, useState } from "react"
import SplashScreen from "@components/general/SplashScreen"
import { SectionContainer } from "@/src/components/general/section"
import { ButtonDanger, ButtonPrimary } from "@components/form/Buttons"
import { UpdateUserProfile } from "@src/services/userManager"
import { ActionHeader, SectionHeader } from "@components/general/section/headers"
import { Wallet } from "@src/services/memory/types"
import { getWallets } from "@src/services/memory"
import { WalletList } from "@/src/components/wallet"

type EventData = {
    kind: number,
    pubkey: string,
    content: string
}

const Home = ({ navigation }: any) => {

    const [loading, setLoading] = useState(true)
    const [wallets, setWallets] = useState<Wallet[]>()

    useEffect(() => {
        handleData()
    }, [])

    const handleData = async () => {
        setLoading(true)

        await UpdateUserProfile()

        const wallets = await getWallets()
        // const sales = await getSales()

        setWallets(wallets)
        // setSales(sales)

        setLoading(false)
    }

    const actionWallet: ActionHeader = {
        icon: "add", action: () => {
            console.log("action -> wallets")
        }
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
                <SectionHeader icon="wallet" label="Wallets" actions={[actionWallet]} />

                {/* Wallets section  */}
                <WalletList wallets={wallets} />

                {/* Sales and Shopping */}
                <SectionHeader icon="cash-outline" label="Purchasing & Sales" />

                {/* Wallets section  */}
                <WalletList  wallets={wallets} />

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