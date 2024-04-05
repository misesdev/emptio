import { WalletButtons, WalletHeader, WalletReceiveModal, WalletTransactions } from "@components/wallet"
import { LinkSection, SectionContainer } from "@components/general/section"
import { SectionHeader } from "@components/general/section/headers"
import { updateWallet } from "@src/services/memory/wallets"
import { getWalletInfo } from "@src/services/bitcoin/mempool"
import { ButtonDanger } from "@components/form/Buttons"
import { useTranslate } from "@src/services/translate"
import { Transaction, Wallet } from "@src/services/memory/types"
import { View, ScrollView, Modal, RefreshControl, TouchableOpacity } from "react-native"
import { useEffect, useState } from "react"
import { Ionicons } from "@expo/vector-icons"
import theme from "@src/theme"
import { walletService } from "@/src/core/walletManager"
import SplashScreen from "@/src/components/general/SplashScreen"
import { useAuth } from "@/src/providers/userProvider"

const WalletManagerScreen = ({ navigation, route }: any) => {

    const { wallet, setWallet } = useAuth()
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [optionsVisible, setOptionsVisible] = useState(false)
    const [receiveVisible, setReceiveVisible] = useState(false)
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
        
        handleLoadTransactions()
        
        setLoading(false)
    }, [])

    const handleLoadTransactions = async () => {
        setRefreshing(true)

        const address = wallet.address ?? ""

        // search transactions and update wallet lastBalance
        const walletInfo = await getWalletInfo(address)

        setTransactions(walletInfo.transactions)

        wallet.lastBalance = walletInfo.balance
        wallet.lastReceived = walletInfo.received
        wallet.lastSended = walletInfo.sended

        await updateWallet(wallet)
        
        if (setWallet)
            setWallet(wallet)

        setRefreshing(false)
    }

    const hadleDeleteWallet = async () => {

        await walletService.exclude(wallet ?? {})

        navigation.navigate("core-stack")
    }

    const openTransaction = (transaction: Transaction) => {
        console.log(transaction)
    }

    if (loading)
        return <SplashScreen />

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
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleLoadTransactions} />}
            >

                <WalletTransactions transactions={transactions} onPressTransaction={openTransaction} />

                <View style={{ width: "100%", height: 62 }}></View>

            </ScrollView>
            <WalletButtons onReceive={setReceiveVisible} onSend={() => navigation.navigate("wallet-send-stack")} />

            <Modal
                transparent
                animationType="slide"
                visible={optionsVisible}
                onRequestClose={() => console.log("close modal")}
            >
                <View style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,.5)" }}>
                    <SectionContainer style={{ maxWidth: "75%" }}>
                        <LinkSection label="compiar endereço" icon="trash" onPress={() => { }} />
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

            <WalletReceiveModal visible={receiveVisible} onClose={setReceiveVisible} address={wallet.address ?? ""} />
        </>
    )
}


export default WalletManagerScreen