import { Transaction, Wallet } from "@src/services/memory/types";
import { View, Text, TouchableOpacity, Image, SafeAreaView, ScrollView } from "react-native";
import { useTranslate } from "@src/services/translate";
import { Ionicons } from "@expo/vector-icons"
import { styles } from "./style"
import theme from "@src/theme";
import { useEffect, useState } from "react";
import SplashScreen from "../general/SplashScreen";
import { IconNames } from "@src/services/types/icons";

type Props = {
    wallets?: Wallet[],
    action: () => void
}

export const WalletList = ({ wallets, action }: Props) => {
    return (
        <SafeAreaView style={{ width: "100%", height: 200 }}>
            <ScrollView horizontal>
                {
                    wallets && wallets.map((wallet, key) => {
                        return (
                            <TouchableOpacity style={[styles.wallet, { backgroundColor: "#eb8f34" }]} key={key}>
                                <Text style={styles.title}>{useTranslate("labels.wallet.add")}</Text>
                                <Text style={styles.description}>{useTranslate("message.wallet.create")}</Text>
                                <TouchableOpacity style={styles.button} onPress={() => { }}>
                                    <Text style={styles.buttonText}> {useTranslate("commons.add")} </Text>
                                </TouchableOpacity>
                            </TouchableOpacity>
                        )
                    })
                }

                <View style={[styles.wallet, { backgroundColor: theme.colors.section }]}>
                    <Text style={styles.title}>{useTranslate("labels.wallet.add")}</Text>
                    <Text style={styles.description}>{useTranslate("message.wallet.create")}</Text>
                    <TouchableOpacity style={styles.button} onPress={action}>
                        <Text style={styles.buttonText}> {useTranslate("commons.add")} </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

type WalletProps = {
    wallet: Wallet
}

export const WalletHeader = ({ wallet }: WalletProps) => {

    var lastBalance = wallet!.lastBalance ? wallet!.lastBalance : 0

    var walletColor = wallet.type == "bitcoin" ? theme.colors.orange : theme.colors.blue

    return (
        <>
            {wallet!.type == "bitcoin" && <Image source={require("assets/images/bitcoin-wallet-header3.jpg")} style={{ width: "100%", height: 240 }} />}
            {wallet!.type == "lightning" && <Image source={require("assets/images/lightning-wallet-header.png")} style={{ width: "100%", height: 240 }} />}
            <View style={styles.headerWallet}>
                <View style={styles.headerWalletSub}>
                    <TouchableOpacity onPress={() => { }}>
                        <Ionicons name="ellipsis-vertical-sharp" color={theme.colors.white} size={theme.icons.large} />
                    </TouchableOpacity>
                </View>
                <Text style={[{ fontSize: 18 }, styles.headerText]}>{wallet!.name}</Text>
                <Text style={[{ fontSize: 30 }, styles.headerText]}>{(lastBalance * 100000000).toFixed(0).toString().replace(/(.)(?=(\d{3})+$)/g, '$1.')} Sats</Text>
                <Text style={[{ fontSize: 14 }, styles.headerText]}>{wallet!.lastBalance?.toFixed(8)} BTC</Text>
                <Text style={[styles.headerText, { fontSize: 12, backgroundColor: walletColor, padding: 10, borderRadius: 15, maxWidth: 130, textAlign: "center" }]}>
                    {wallet!.type == "bitcoin" && "Bitcoin Wallet"}
                    {wallet!.type == "lightning" && "Lightning Wallet"}
                </Text>
            </View>
        </>
    )
}

export const WalletTransactions = ({ wallet }: WalletProps) => {

    const [loading, setLoading] = useState(true)
    const [transactions, setTransactions] = useState<Transaction[]>([])

    useEffect(() => {

        // setTransactions([
        //     { type: "received", amount: 0.05603200, description: "buy for hodl", date: "16/08/2023 08:90" },
        // ])
        setTimeout(() => setLoading(false), 1000)

    }, [])

    const AmmountText = ({ type, amount }: Transaction) => {
        let operator = type == "received" ? "+" : "-"
        let color = type == "received" ? theme.colors.green : theme.colors.red
        let satoshis = amount ? `${(amount * 100000000).toFixed(0).toString().replace(/(.)(?=(\d{3})+$)/g, '$1.')}` : ""

        return <Text style={{ color: color, margin: 2, fontWeight: "bold" }}>{operator + satoshis}</Text>
    }

    const TransactionIcon = ({ type }: Transaction) => {

        let rotate = type == "received" ? "90deg" : "-90deg"
        let icon: IconNames = type == "received" ? "enter" : "exit"
        let color = type == "received" ? theme.colors.green : theme.colors.red

        return <Ionicons name={icon} size={theme.icons.medium} color={color} style={{ transform: [{ rotate: rotate }] }} />
    }

    return (
        <>
            <View style={styles.sectionTransactions}>
                {loading && <SplashScreen />}

                {!loading &&
                    transactions?.map((transaction, key) => {

                        if (transaction.description!.length > 18)
                            transaction.description = `${transaction.description?.substring(0, 20)}..`
                        else if (!transaction!.description)
                            transaction.description = useTranslate("commons.nodescription")

                        return (
                            <TouchableOpacity style={styles.sectionTransaction} key={key} activeOpacity={.7}>
                                {/* Transaction Type */}
                                <View style={{ width: "18%", minHeight: 75, justifyContent: "center", alignItems: "center" }}>
                                    <TransactionIcon type={transaction.type} />
                                </View>
                                {/* Transaction Description and Date */}
                                <View style={{ width: "50%", minHeight: 75 }}>
                                    <View style={{ width: "100%" }}>
                                        <Text style={{ color: theme.colors.white, fontFamily: "", fontSize: 18, fontWeight: "600", margin: 2, marginTop: 12 }}>
                                            {transaction.description}
                                        </Text>
                                    </View>
                                    <View style={{ width: "100%" }}>
                                        <Text style={{ color: theme.colors.gray, margin: 2, fontWeight: "bold" }}>{transaction.date}</Text>
                                    </View>
                                </View>
                                {/* Transaction Ammount */}
                                <View style={{ width: "32%", minHeight: 75, justifyContent: "center", alignItems: "center" }}>
                                    <AmmountText type={transaction.type} amount={transaction.amount} />
                                    <Text style={{ color: theme.colors.gray, margin: 0 }}>sats</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })
                }

                {
                    !loading && transactions!.length <= 0 &&
                    <Text style={{ color: theme.colors.gray, textAlign: "center" }}>
                        {useTranslate("section.title.transactions.empty")}
                    </Text>
                }
            </View>
        </>
    )
}

export const WalletButtons = ({ wallet }: WalletProps) => {

    return (
        <View style={styles.walletButtonsSection}>
            <View style={{ flexDirection: "row" }}>
                <TouchableOpacity style={[styles.walletActionButton, { borderRightWidth: .2, borderBottomLeftRadius: 15, borderTopLeftRadius: 15 }]} activeOpacity={.7}>

                    <Ionicons style={{ margin: 5 }} name="enter" color={theme.colors.white} size={theme.icons.medium} />
                    <Text style={styles.walletaAtionText} >{useTranslate("commons.receive")}</Text>

                </TouchableOpacity>
                <TouchableOpacity style={[styles.walletActionButton, { borderLeftWidth: .2, borderBottomRightRadius: 15, borderTopRightRadius: 15 }]} activeOpacity={.7} >

                    <Text style={styles.walletaAtionText} >{useTranslate("commons.send")}</Text>
                    <Ionicons style={{ margin: 5 }} name="exit" color={theme.colors.white} size={theme.icons.medium} />

                </TouchableOpacity>
            </View>
        </View>
    )
}