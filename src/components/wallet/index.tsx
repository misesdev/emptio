import { View, Text, TouchableOpacity, Image, SafeAreaView, ScrollView } from "react-native";
import { Transaction, Wallet } from "@src/services/memory/types";
import { formatSats, toBitcoin } from "@src/services/converter";
import { useTranslate } from "@src/services/translate";
import { IconNames } from "@src/services/types/icons";
import { Ionicons } from "@expo/vector-icons"
import { styles } from "./style"
import theme from "@src/theme";

type Props = {
    wallets: Wallet[],
    navigation: any
}

export const WalletList = ({ wallets, navigation }: Props) => {

    return (
        <SafeAreaView style={{ width: "100%", height: 220 }}>
            <ScrollView horizontal>
                {wallets &&
                    wallets.map((wallet, key) => {
                        let balanceSats = formatSats(wallet.lastBalance)
                        let balanceBTC = toBitcoin(wallet.lastBalance)
                        let baseColor = wallet.type === "bitcoin" ? theme.colors.orange : theme.colors.blue
                        let typyWallet = wallet.type === "bitcoin" ? useTranslate("wallet.bitcoin.tag") : useTranslate("wallet.lightning.tag")
                        return (
                            <TouchableOpacity style={[styles.wallet, { paddingHorizontal: 5 }]} key={key} activeOpacity={1}>
                                {wallet!.type === "bitcoin" && <Image source={require("assets/images/bitcoin-wallet-header3.jpg")} style={{ position: "absolute", borderRadius: 18, width: "100%", height: "100%" }} />}
                                {wallet!.type === "lightning" && <Image source={require("assets/images/lightning-wallet-header.png")} style={{ position: "absolute", borderRadius: 18, width: "100%", height: "100%" }} />}
                                <View style={{ position: "absolute", width: "100%", height: "100%", borderRadius: 18, backgroundColor: "rgba(0,55,55,.7)" }}></View>

                                <Text style={styles.title}>{wallet.name}</Text>
                                <Text style={{ marginHorizontal: 10, marginVertical: 6, color: theme.colors.white, fontSize: 18, fontWeight: "bold" }}>{balanceSats} Sats</Text>
                                <Text style={[styles.description, { color: theme.colors.white }]}>{balanceBTC} BTC</Text>
                                <TouchableOpacity activeOpacity={.7} style={[styles.button, { backgroundColor: baseColor }]} onPress={() => navigation.navigate("wallet-stack", { wallet })}>
                                    <Text style={styles.buttonText}> {useTranslate("commons.open")} </Text>
                                </TouchableOpacity>

                                <Text style={{
                                    backgroundColor: theme.colors.gray, color: theme.colors.white, margin: 10, borderRadius: 10,
                                    fontSize: 10, fontWeight: "bold", paddingHorizontal: 10, paddingVertical: 4, position: "absolute", top: -18, right: 14,
                                }}>{typyWallet}</Text>
                            </TouchableOpacity>
                        )
                    })
                }

                <View style={[styles.wallet, { backgroundColor: theme.colors.section, padding: 5 }]}>
                    <Text style={styles.title}>{useTranslate("labels.wallet.add")}</Text>
                    <Text style={[styles.description, { color: theme.colors.gray }]}>{useTranslate("message.wallet.create")}</Text>
                    <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.blue }]} activeOpacity={.7} onPress={() => navigation.navigate("add-wallet-stack")}>
                        <Text style={styles.buttonText}> {useTranslate("commons.add")} </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

type WalletProps = {
    wallet: Wallet,
    showOptions?: () => void
}

export const WalletHeader = ({ wallet, showOptions }: WalletProps) => {

    let balanceSats = formatSats(wallet.lastBalance)
    let balanceBTC = toBitcoin(wallet.lastBalance)

    let walletColor = wallet.type == "bitcoin" ? theme.colors.orange : theme.colors.blue

    return (
        <>
            {wallet!.type == "bitcoin" && <Image source={require("assets/images/bitcoin-wallet-header3.jpg")} style={{ width: "100%", height: 240 }} />}
            {wallet!.type == "lightning" && <Image source={require("assets/images/lightning-wallet-header.png")} style={{ width: "100%", height: 240 }} />}
            <View style={styles.headerWallet}>
                <View style={{ height: 50 }}></View>
                <Text style={[{ fontSize: 18 }, styles.headerText]}>{wallet!.name}</Text>
                <Text style={[{ fontSize: 30 }, styles.headerText]}>{balanceSats} Sats</Text>
                <Text style={[{ fontSize: 14 }, styles.headerText]}>{balanceBTC} BTC</Text>
                <Text style={[styles.headerText, { fontSize: 12, backgroundColor: walletColor, padding: 10, borderRadius: 15, maxWidth: 130, textAlign: "center" }]}>
                    {wallet!.type == "bitcoin" && "Bitcoin Wallet"}
                    {wallet!.type == "lightning" && "Lightning Wallet"}
                </Text>
            </View>
        </>
    )
}

type WalletTransactionsProps = {
    transactions: Transaction[],
    onPressTransaction: (transaction: Transaction) => void
}

export const WalletTransactions = ({ transactions, onPressTransaction }: WalletTransactionsProps) => {

    const AmmountText = ({ type, amount }: Transaction) => {

        let operator = type == "received" ? "+" : "-"
        let ammountSatoshis = operator + formatSats(amount)
        let color = type == "received" ? theme.colors.green : theme.colors.red

        return <Text style={{ color: color, margin: 2, fontWeight: "bold" }}>{ammountSatoshis}</Text>
    }

    const TransactionIcon = ({ type, confirmed }: Transaction) => {

        let color = theme.colors.red
        let rotate = type == "received" ? "90deg" : "-90deg"
        let icon: IconNames = type == "received" ? "enter" : "exit"


        if(type == "received")
            color = confirmed ? theme.colors.green : theme.colors.yellow

        return <Ionicons name={icon} size={theme.icons.medium} color={color} style={{ transform: [{ rotate: rotate }] }} />
    }

    return (
        <View style={styles.sectionTransactions}>
            {transactions && 
                transactions.map((transaction, key) => {
                    return (
                        <TouchableOpacity style={styles.sectionTransaction} onPress={() => onPressTransaction(transaction)} key={key} activeOpacity={.7}>
                            {/* Transaction Type */}
                            <View style={{ width: "18%", minHeight: 75, justifyContent: "center", alignItems: "center" }}>
                                <TransactionIcon type={transaction.type} confirmed={transaction.confirmed} />
                            </View>
                            {/* Transaction Description and Date */}
                            <View style={{ width: "50%", minHeight: 75 }}>
                                <View style={{ width: "100%" }}>
                                    <Text style={{ color: theme.colors.white, fontFamily: "", fontSize: 14, fontWeight: "600", margin: 2, marginTop: 12 }}>
                                        {transaction.description}
                                    </Text>
                                </View>
                                <View style={{ width: "100%" }}>
                                    <Text style={{ fontSize: 12, color: theme.colors.gray, margin: 2, fontWeight: "bold" }}>{transaction.date}</Text>
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
                transactions.length <= 0 &&
                <Text style={{ color: theme.colors.gray, textAlign: "center" }}>
                    {useTranslate("section.title.transactions.empty")}
                </Text>
            }

            <View style={{ height: 80 }}></View>
        </View>
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