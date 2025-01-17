import { WalletButtons, WalletHeader, WalletTransactions } from "@components/wallet"
import { SectionHeader } from "@components/general/section/headers"
import { Transaction, TransactionInfo, Wallet } from "@src/services/memory/types"
import { View, ScrollView, RefreshControl, TouchableOpacity } from "react-native"
import { useEffect, useState } from "react"
import { Ionicons } from "@expo/vector-icons"
import SplashScreen from "@components/general/SplashScreen"
import theme from "@src/theme"
import { walletService } from "@/src/core/walletManager"
import { useTranslateService } from "@/src/providers/translateProvider"

const WalletManagerScreen = ({ navigation, route }: any) => {

    const wallet = route.params.wallet as Wallet
    const { useTranslate } = useTranslateService()
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [transactions, setTransactions] = useState<Transaction[]>([])

    useEffect(() => {

        // add to header menu wallet options 
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={{ paddingHorizontal: 5, marginHorizontal: 10 }} onPress={() => navigation.navigate("wallet-settings-stack", { wallet })}>
                    <Ionicons name="ellipsis-vertical-sharp" color={theme.colors.white} size={theme.icons.large} />
                </TouchableOpacity>
            )
        })

        handleLoadTransactions()

        setLoading(false)

    }, [])

    const handleLoadTransactions = async () => {
        setRefreshing(true)

        const address = wallet.address ?? ""
        // search transactions and update wallet lastBalance
        const walletInfo = await walletService.listTransactions(address)

        setTransactions(walletInfo.transactions)

        wallet.lastBalance = walletInfo.balance
        wallet.lastReceived = walletInfo.received
        wallet.lastSended = walletInfo.sended

        await walletService.update(wallet)

        setRefreshing(false)
    }

    const openTransaction = (transaction: TransactionInfo) => {
        navigation.navigate("wallet-transaction-stack", { wallet, transaction })
    }

    const showOptions = (wallet: Wallet) => {
        navigation.navigate("wallet-settings-stack", { wallet })
    }

    if (loading)
        return <SplashScreen />

    return (
        <>
            <WalletHeader wallet={wallet} showOptions={() => showOptions(wallet)} />

            <SectionHeader
                icon="repeat-outline"
                label={useTranslate("section.title.transactions")}
                actions={[{ icon: "reload", action: handleLoadTransactions }]}
            />

            <ScrollView
                contentContainerStyle={theme.styles.scroll_container}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleLoadTransactions} />}
            >

                <WalletTransactions transactions={transactions} onPressTransaction={openTransaction} />

                <View style={{ width: "100%", height: 62 }}></View>

            </ScrollView>

            <WalletButtons
                onReceive={() => navigation.navigate("add-wallet-receive-stack", { wallet })}
                onSend={() => navigation.navigate("wallet-send-stack", { wallet })}
            />
        </>
    )
}

export default WalletManagerScreen
