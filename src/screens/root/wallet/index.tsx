import { WalletButtons, WalletHeader, WalletTransactions } from "@components/wallet"
import { LinkSection, SectionContainer } from "@components/general/section"
import { SectionHeader } from "@components/general/section/headers"
import { deleteWallet, updateWallet } from "@src/services/memory/wallets"
import { ButtonDanger } from "@components/form/Buttons"
import { useTranslate } from "@src/services/translate"
import { Transaction, Wallet } from "@src/services/memory/types"
import { View, ScrollView, Modal, RefreshControl, TouchableOpacity } from "react-native"
import { useEffect, useState } from "react"
import { Ionicons } from "@expo/vector-icons"
import theme from "@src/theme"

const WalletManagerScreen = ({ navigation, route }: any) => {

    const [loading, setLoading] = useState(true)
    const [wallet, setWallet] = useState<Wallet>({})
    const [optionsVisible, setOptionsVisible] = useState(false)
    const [transactions, setTransactions] = useState<Transaction[]>([])

    useEffect(() => {

        // add to header menu wallet options 
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={() => setOptionsVisible(true)}>
                    <Ionicons name="ellipsis-vertical-sharp" color={theme.colors.white} size={theme.icons.large} />
                </TouchableOpacity>
            )
        })

        setWallet(route.params?.wallet)

        handleLoadTransactions()

    }, [])

    const handleLoadTransactions = async () => {
        setLoading(true)

        // search transactions and update wallet lastBalance
        setTransactions(Array.from({ length: 12 }).map<Transaction>(item => {
            return {
                type: Math.random() < .5 ? "received" : "sended",
                description: "buy for hodl in my wallet",
                date: new Date(Math.random() * 8453345452343).toLocaleString(),
                amount: (Math.random() / 50)
            }
        }))

        wallet.lastBalance = transactions.reduce((acumulator, current) => (acumulator + (current.amount ? current.amount : 0)), 0)

        // if (wallet)
        //     await updateWallet(wallet)

        setLoading(false)
    }

    const hadleDeleteWallet = async () => {

        await deleteWallet(wallet)

        navigation.navigate("core-stack")
    }

    const openTransaction = (transaction: Transaction) => {
        console.log(transaction)
    }

    return (
        <>
            <WalletHeader wallet={wallet} showOptions={() => setOptionsVisible(true)} />

            <SectionHeader
                icon="repeat-outline"
                label={useTranslate("section.title.transactions")}
                actions={[{ icon: "reload", action: handleLoadTransactions }]}
            />

            <ScrollView
                contentContainerStyle={theme.styles.scroll_container}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={handleLoadTransactions} />}
            >

                <WalletTransactions transactions={transactions} onPressTransaction={openTransaction} />

                <View style={{ width: "100%", height: 62 }}></View>

            </ScrollView>
            <WalletButtons wallet={wallet} />

            <Modal
                transparent
                animationType="slide"
                visible={optionsVisible}
                onRequestClose={() => console.log("close modal")}
            >
                <View style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,.8)" }}>
                    <SectionContainer style={{ maxWidth: "75%" }}>
                        <LinkSection label={useTranslate("commons.delete")} icon="trash" onPress={hadleDeleteWallet} />
                        {/* <LinkSection label={useTranslate("commons.close")} icon="close-circle" onPress={() => setOptionsVisible(false)} /> */}
                    </SectionContainer>

                    <View style={{ width: "100%", position: "absolute", bottom: 75, alignItems: "center" }}>
                        <ButtonDanger
                            leftIcon="close-circle"
                            label={useTranslate("commons.close")}
                            onPress={() => setOptionsVisible(false)}
                        />
                    </View>
                </View>
            </Modal>
        </>
    )
}


export default WalletManagerScreen