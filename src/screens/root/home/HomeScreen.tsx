import { RefreshControl, ScrollView, StyleSheet, View, } from "react-native"
import { ActionHeader, SectionHeader } from "@components/general/section/headers"
import { useTranslateService } from "@src/providers/TranslateProvider"
import WalletList from "@components/wallet/WalletList"
import { StackScreenProps } from "@react-navigation/stack"
import { useHomeState } from "./hooks/useHomeState"
import { HeaderHome } from "./header/HeaderHome"
import { useEffect } from "react"
import theme from "@src/theme"
import NewWalletModal, { showNewWaleltModal } from "../wallet/new/NewWalletModal"

const HomeScreen = ({ navigation }: StackScreenProps<any>) => {

    const { useTranslate } = useTranslateService()
    const { loading, wallets, loadData } = useHomeState() 

    useEffect(() => { 
        navigation.setOptions({ header: () => <HeaderHome navigation={navigation} /> })
        setTimeout(loadData, 20) 
    }, [])

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
                <WalletList wallets={wallets} navigation={navigation} />

                {/* Sales and Shopping section*/}
                {/* <SectionHeader icon="cash-outline" label={useTranslate("section.title.sales")} /> */}

            </ScrollView>
            <NewWalletModal navigation={navigation} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { backgroundColor: theme.colors.black, height: "100%" },
})

export default HomeScreen
