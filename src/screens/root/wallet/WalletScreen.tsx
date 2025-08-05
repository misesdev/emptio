import { WalletButtons, WalletHeader, WalletTransactions } from "@components/wallet"
import { SectionHeader } from "@components/general/section/headers"
import { View, ScrollView, RefreshControl, TouchableOpacity } from "react-native"
import { useTranslateService } from "@src/providers/TranslateProvider"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { StackScreenProps } from "@react-navigation/stack"
import { useWallet } from "./hooks/useWallet"
import { useEffect } from "react"
import theme from "@src/theme"

const WalletScreen = ({ navigation, route }: StackScreenProps<any>) => {

    const { useTranslate } = useTranslateService()
    const {
        wallet, utxos, transactions, refreshing, showOptions, 
        openTransaction, loadTransactions 
    } = useWallet({ navigation, route })

    useEffect(() => {
        // add to header menu wallet options 
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity 
                    style={{ paddingHorizontal: 5, marginHorizontal: 10 }}
                    onPress={() => navigation.navigate("wallet-settings", { wallet })}
                >
                    <Ionicons
                        name="ellipsis-vertical-sharp" 
                        color={theme.colors.white} 
                        size={theme.icons.large}
                    />
                </TouchableOpacity>
            )
        })
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <WalletHeader wallet={wallet} showOptions={showOptions} />

            <SectionHeader
                icon="repeat-outline"
                label={useTranslate("section.title.transactions")}
                actions={[{ icon: "reload", action: loadTransactions }]}
            />

            <ScrollView
                contentContainerStyle={theme.styles.scroll_container}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={loadTransactions} />
                }
            >
                <WalletTransactions 
                    transactions={transactions} 
                    onPressTransaction={openTransaction} 
                />

                <View style={{ width: "100%", height: 50 }}></View>

            </ScrollView>

            <WalletButtons
                onReceive={() => navigation.navigate("wallet-receive", { wallet })}
                onSend={() => navigation.navigate("wallet-send", { wallet })}
            />
        </View>
    )
}

export default WalletScreen
