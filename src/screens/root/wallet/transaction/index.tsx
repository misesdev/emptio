import { formatSats } from "@/src/services/converter"
import { TransactionInfo, Transaction, Wallet } from "@/src/services/memory/types"
import { IconNames } from "@/src/services/types/icons"
import theme from "@/src/theme"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { useEffect, useState } from "react"
import { Linking, ScrollView, StyleSheet, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { walletService } from "@/src/core/walletManager"
import { SectionHeader } from "@/src/components/general/section/headers"
import { ActivityIndicator } from "react-native-paper"
import { SectionContainer } from "@/src/components/general/section"
import { ButtonPrimary } from "@/src/components/form/Buttons"
import { useTranslateService } from "@/src/providers/translateProvider"
import { Network } from "@/src/services/bitcoin/types"
import env from "@/env"

const TransactionIcon = ({ type, confirmed }: TransactionInfo) => {
    let color = theme.colors.red
    let rotate = type == "received" ? "90deg" : "-90deg"
    let icon: IconNames = type == "received" ? "enter" : "exit"


    if (type == "received")
        color = confirmed ? theme.colors.green : theme.colors.yellow

    return <Ionicons name={icon} size={60} color={color} style={{ margin: 10, transform: [{ rotate: rotate }] }} />
}

const TransactionScreen = ({ navigation, route }: any) => {

    const { useTranslate } = useTranslateService()
    const [loading, setLoading] = useState<boolean>(true)
    const [txDetails, setTxDetails] = useState<Transaction>({})
    const { wallet, transaction } = route.params as { wallet: Wallet, transaction: TransactionInfo }

    useEffect(() => { loadData() }, [])

    const loadData = async () => {
        
        const network: Network = wallet.type == "bitcoin" ? "mainnet" : "testnet"

        const transactionDetails = await walletService.transaction.details(transaction.txid ?? "", network)

        setTxDetails(transactionDetails)

        setLoading(false)
    }

    const handleToWeb = () => { 

        const directory = wallet.type == "bitcoin" ? "tx/" : "testnet/tx/"

        Linking.openURL(`https://${env.mempool.hostname}/${directory}${txDetails.txid}`)
    }

    return (
        <>
            <HeaderScreen title={useTranslate("wallet.transaction.title")} onClose={() => navigation.navigate("wallet-stack", { wallet })} />
            
            <View style={{ alignItems: "center", alignContent: "center" }}>
                <TransactionIcon type={transaction.type} confirmed={transaction.confirmed} /> 
                
                <Text style={styles.amount}>{formatSats(transaction.amount)} Sats</Text>
            </View>
            
            <View style={{ height: 30 }}></View>

            <SectionHeader label={useTranslate("wallet.transaction.details")} />

            <ScrollView contentContainerStyle={theme.styles.scroll_container}>
                               
                {loading && <ActivityIndicator size={40} color={theme.colors.gray}/>}

                { !loading &&
                    <>                        
                        <SectionContainer style={{ width: "94%", padding: 14 }}>
                            <View style={{ flexDirection: "row" }}>
                                <Text style={[styles.infoLabels, { width: "50%"}]}>{useTranslate("wallet.transaction.balance")}</Text>
                                <Text style={[styles.infoLabels, {width: "50%"}]}>
                                    {formatSats(txDetails.amount)} Sats
                                </Text>
                            </View>
                            
                            <View style={{ flexDirection: "row" }}>
                                <Text style={[styles.infoLabels, { width: "50%"}]}>{useTranslate("wallet.transaction.fee")}</Text>
                                <Text style={[styles.infoLabels, {width: "50%"}]}>
                                    {formatSats(txDetails.fee)} Sats
                                </Text>
                            </View>

                            <View style={{ flexDirection: "row" }}>
                                <Text style={[styles.infoLabels, { width: "50%"}]}>{useTranslate("wallet.transaction.date")}</Text>
                                <Text style={[styles.infoLabels, {width: "50%"}]}>
                                    {txDetails.date ?? "--/--/--"}
                                </Text>
                            </View>
                            <View style={{ flexDirection: "row" }}>
                                <Text style={[styles.infoLabels, { width: "50%"}]}>{useTranslate("wallet.transaction.size")}</Text>
                                <Text style={[styles.infoLabels, {width: "50%"}]}>
                                    {formatSats(txDetails.size)} bytes
                                </Text>
                            </View>

                            <View style={{ flexDirection: "row" }}>
                                <Text style={[styles.infoLabels, { width: "50%"}]}>{useTranslate("wallet.transaction.block-hight")}</Text>
                                <Text style={[styles.infoLabels, {width: "50%"}]}>
                                    {formatSats(txDetails.block_height)}
                                </Text>
                            </View>

                            
                            <Text style={[styles.title, {marginTop: 10}]}>Tx Id</Text>
                            <Text style={[styles.infoLabels]}>
                                {txDetails.txid}
                            </Text>

                        </SectionContainer>

                        <SectionContainer style={{ width: "94%", padding: 14 }}>
                            <Text style={styles.title}>
                                {useTranslate("wallet.transaction.inputs")} ({txDetails.inputs?.length})
                            </Text>
                            {
                                txDetails.inputs?.map((tx, key) => {
                                    return (
                                        <Text key={key} style={styles.infoLabels}>
                                            <Text style={[styles.infoLabels, { fontWeight: "500" }]}>
                                                {formatSats(tx.amount)} sats
                                            </Text> - {tx.address}
                                        </Text>
                                    )
                                })
                            }
                        </SectionContainer>

                        <SectionContainer style={{ padding: 14 }}>
                            <Text style={styles.title}>
                                {useTranslate("wallet.transaction.outputs")} ({txDetails.outputs?.length})
                            </Text>
                            {
                                txDetails.outputs?.map((tx, key) => {
                                    return (
                                        <Text key={key} style={styles.infoLabels}>
                                            <Text style={[styles.infoLabels, { fontWeight: "500" }]}>
                                                {formatSats(tx.amount)} sats
                                            </Text> - {tx.address}
                                        </Text>
                                    )
                                })
                            }
                        </SectionContainer>

                        <ButtonPrimary onPress={handleToWeb} label={useTranslate("wallet.transaction.view-web")} />

                        <View style={{ height: 30 }}></View>
                    </>
                }
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    title: { fontSize: 16, fontWeight: "bold", color: theme.colors.gray },
    amount: { color: theme.colors.white, fontWeight: "700", fontSize: 28 },
    infoLabels: { color: theme.colors.gray, marginVertical: 6 }
})

export default TransactionScreen
