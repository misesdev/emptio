
import { View, ScrollView } from "react-native"
import theme from "@src/theme"
import { WalletButtons, WalletHeader, WalletTransactions } from "@src/components/wallet"
import { useEffect } from "react"
import { SectionHeader } from "@components/general/section/headers"
import { useTranslate } from "@/src/services/translate"
import { Wallet } from "@/src/services/memory/types"

const WalletManager = ({ navigation }: any) => {

    const wallet: Wallet = { type: "bitcoin", name: "My First Wallet", lastBalance: 0.09684900 }

    useEffect(() => {

    }, [])

    return (
        <>
            <WalletHeader wallet={wallet} />
            
            <SectionHeader icon="repeat-outline" label={useTranslate("section.title.transactions")} />

            <ScrollView contentContainerStyle={theme.styles.scroll_container}>

                <WalletTransactions wallet={wallet} />

                <View style={{ width: "100%", height: 62 }}></View>

            </ScrollView>
            <WalletButtons wallet={wallet}/>
        </>
    )
}


export default WalletManager