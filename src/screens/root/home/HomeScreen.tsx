import { RefreshControl, ScrollView, StyleSheet, View, } from "react-native"
import { ActionHeader, SectionHeader } from "@components/general/section/headers"
import { useTranslateService } from "@src/providers/TranslateProvider"
import NewWalletModal, { showNewWaleltModal } from "../wallet/new/NewWalletModal"
import { BTransaction } from "@services/wallet/types/Transaction"
import { WalletTransactions } from "@components/wallet"
import WalletList from "@components/wallet/WalletList"
import { StackScreenProps } from "@react-navigation/stack"
import { useHomeState } from "./hooks/useHomeState"
import { HeaderHome } from "./header/HeaderHome"
import { useCallback, useEffect } from "react"
import theme from "@src/theme"

const HomeScreen = ({ navigation }: StackScreenProps<any>) => {

    const { useTranslate } = useTranslateService()
    const { loading, wallets, transactions, loadData } = useHomeState() 

    useEffect(() => { 
        navigation.setOptions({ header: () => <HeaderHome navigation={navigation} /> })
        const load = async () => loadData()
        load()
    }, [])

    const openWallet = useCallback((id: string) => {
        navigation.navigate("wallet-screen", { id })
    }, [navigation])


    const openTransaction = useCallback((transaction: BTransaction) => {
        navigation.navigate("wallet-transaction", { transaction })
    }, [navigation])
    
    const actionWallet: ActionHeader = {
        icon: "add", action: showNewWaleltModal
    }

    return (
        <View style={styles.container}>            
            <ScrollView
                contentContainerStyle={[theme.styles.scroll_container, {}]}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} />}
            >
                {/* Wallets */}
                <SectionHeader
                    icon="wallet" 
                    label={useTranslate("section.title.wallets")} 
                    actions={[actionWallet]}
                />

                {/* Wallets section  */}
                <WalletList wallets={wallets} openWallet={openWallet} />

                {/* All Transactions */}
                <SectionHeader
                    icon="repeat-outline" 
                    label={useTranslate("section.title.transactions")} 
                />
                <ScrollView
                    contentContainerStyle={theme.styles.scroll_container}
                >
                    <WalletTransactions
                        transactions={transactions} 
                        onPressTransaction={openTransaction}
                    /> 
                </ScrollView>

            </ScrollView>
            <NewWalletModal navigation={navigation} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { backgroundColor: theme.colors.black, height: "100%" },
})

export default HomeScreen
