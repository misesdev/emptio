import { WalletButtons, WalletHeader, WalletTransactions } from "@components/wallet"
import { SectionHeader } from "@components/general/section/headers"
import { View, ScrollView, RefreshControl, TouchableOpacity } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useTranslateService } from "@src/providers/translateProvider"
import { StackScreenProps } from "@react-navigation/stack"
import { useEffect } from "react"
import theme from "@src/theme"
import { useWallet } from "./hooks/use-wallet"

const WalletManagerScreen = ({ navigation, route }: StackScreenProps<any>) => {

    const { useTranslate } = useTranslateService()
    const {
        wallet, transactions, refreshing, showOptions, 
        openTransaction, loadTransactions 
    } = useWallet({ navigation, route })

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
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadTransactions} />}
            >
                <WalletTransactions 
                    transactions={transactions} 
                    onPressTransaction={openTransaction} 
                />

                <View style={{ width: "100%", height: 50 }}></View>

            </ScrollView>

            <WalletButtons
                onReceive={() => navigation.navigate("wallet-receive-stack", { wallet })}
                onSend={() => navigation.navigate("wallet-send-stack", { wallet })}
            />
        </View>
    )
}

export default WalletManagerScreen
