import { formatSats } from "@services/converter"
import { TransactionInfo, Transaction, Wallet } from "@services/memory/types"
import { IconNames } from "@services/types/icons"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { useEffect, useState } from "react"
import { Linking, ScrollView, StyleSheet, Text, View } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { SectionHeader } from "@components/general/section/headers"
import { ActivityIndicator } from "react-native-paper"
import { SectionContainer } from "@components/general/section"
import { ButtonPrimary } from "@components/form/Buttons"
import { useTranslateService } from "@src/providers/translateProvider"
import { StackScreenProps } from "@react-navigation/stack"
import { walletService } from "@services/wallet"
import { BNetwork } from "bitcoin-tx-lib"
import theme from "@src/theme"

const TransactionIcon = ({ type, confirmed }: TransactionInfo) => {
    let color = theme.colors.red
    let rotate = type == "received" ? "90deg" : "-90deg"
    let icon: IconNames = type == "received" ? "enter" : "exit"

    if (type == "received")
        color = confirmed ? theme.colors.green : theme.colors.yellow

    return <Ionicons name={icon} size={60} color={color} style={{ margin: 10, transform: [{ rotate: rotate }] }} />
}

const TransactionScreen = ({ navigation, route }: StackScreenProps<any>) => {

    const { useTranslate } = useTranslateService()
    const [loading, setLoading] = useState<boolean>(true)
    const [txDetails, setTxDetails] = useState<Transaction>({})
    const { wallet, transaction } = route.params as { wallet: Wallet, transaction: TransactionInfo }

    useEffect(() => { loadData() }, [])

    const loadData = async () => {
        
        const network: BNetwork = wallet.type == "bitcoin" ? "mainnet" : "testnet"

        const transactionDetails = await walletService.transaction.details(
            transaction.txid ?? "", network, wallet.address ?? "")

        setTxDetails(transactionDetails)

        setLoading(false)
    }

    const handleToWeb = () => { 

        const directory = wallet.network == "mainnet" ? "tx/" : "testnet/tx/"

        Linking.openURL(`https://${process.env.MEMPOOL_API_URL}/${directory}${txDetails.txid}`)
    }

    return (
        <View style={{ flex: 1 }}>
            <HeaderScreen title={useTranslate("wallet.transaction.title")} onClose={() => navigation.goBack()} />
            
            <View style={{ alignItems: "center", alignContent: "center" }}>
                <TransactionIcon type={transaction.type} confirmed={transaction.confirmed} /> 
                
                <Text style={styles.amount}>
                    {transaction.type == "sended" ? '-' : '+'}
                    {formatSats(transaction.amount)} Sats
                </Text>
            </View>
            
            <View style={{ height: 30 }}></View>

            <SectionHeader label={useTranslate("wallet.transaction.details")} />

            <ScrollView contentContainerStyle={theme.styles.scroll_container}>
                               
                {loading && <ActivityIndicator size={40} color={theme.colors.gray}/>}

                {!loading &&
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

                        <SectionContainer style={{ width: "94%", padding: 14 }}>
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
        </View>
    )
}

const styles = StyleSheet.create({
    title: { fontSize: 16, fontWeight: "bold", color: theme.colors.gray },
    amount: { color: theme.colors.white, fontWeight: "700", fontSize: 28 },
    infoLabels: { color: theme.colors.gray, marginVertical: 6 }
})

export default TransactionScreen
