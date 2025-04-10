import { WalletButtons, WalletHeader, WalletTransactions } from "@components/wallet"
import { SectionHeader } from "@components/general/section/headers"
import { Transaction, TransactionInfo, Wallet } from "@services/memory/types"
import { View, ScrollView, RefreshControl, TouchableOpacity } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useTranslateService } from "@src/providers/translateProvider"
import { StackScreenProps } from "@react-navigation/stack"
import { useCallback, useEffect, useState } from "react"
import { walletService } from "@services/wallet"
import { storageService } from "@services/memory"
import theme from "@src/theme"

const WalletManagerScreen = ({ navigation, route }: StackScreenProps<any>) => {

    const { useTranslate } = useTranslateService()
    const [refreshing, setRefreshing] = useState(false)
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [wallet, setWallet] = useState<Wallet>(route.params?.wallet)

    useEffect(() => {
        // add to header menu wallet options 
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={{ paddingHorizontal: 5, marginHorizontal: 10 }}
                    onPress={() => navigation.navigate("wallet-settings-stack", { wallet })}
                >
                    <Ionicons name="ellipsis-vertical-sharp" color={theme.colors.white} size={theme.icons.large} />
                </TouchableOpacity>
            )
        })
        setTimeout(handleLoadTransactions, 20)
    }, [])

    const handleLoadTransactions = async () => {
        setRefreshing(true)
        // search transactions and update wallet lastBalance
        let walletInfo = await  walletService.listTransactions(wallet)
        setTransactions(walletInfo.transactions)
        if(wallet.lastBalance != walletInfo.balance) {
            setWallet((prev: Wallet) => ({
                ...prev,
                lastBalance: walletInfo.balance,
                lastReceived: walletInfo.received,
                lastSended: walletInfo.sended
            }))
            setTimeout(() => storageService.wallets.update({...wallet}), 20)
        }
        setRefreshing(false)
    }

    const openTransaction = useCallback((transaction: TransactionInfo) => {
        navigation.navigate("wallet-transaction-stack", { wallet, transaction })
    }, [wallet, navigation])

    const showOptions = useCallback(() => {
        navigation.navigate("wallet-settings-stack", { wallet })
    }, [wallet, navigation])

    return (
        <View style={{ flex: 1 }}>
            <WalletHeader wallet={wallet} showOptions={showOptions} />

            <SectionHeader
                icon="repeat-outline"
                label={useTranslate("section.title.transactions")}
                actions={[{ icon: "reload", action: handleLoadTransactions }]}
            />

            <ScrollView
                contentContainerStyle={theme.styles.scroll_container}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleLoadTransactions} />}
            >
                <WalletTransactions 
                    transactions={transactions} 
                    onPressTransaction={openTransaction} 
                />

                <View style={{ width: "100%", height: 50 }}></View>

            </ScrollView>

            <WalletButtons
                onReceive={() => navigation.navigate("add-wallet-receive-stack", { wallet })}
                onSend={() => navigation.navigate("wallet-send-stack", { wallet })}
            />
        </View>
    )
}

export default WalletManagerScreen
