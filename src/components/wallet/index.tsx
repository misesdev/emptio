import { View, Text, TouchableOpacity, Image, SafeAreaView, ScrollView, Modal, StatusBar } from "react-native";
import { Transaction, Wallet } from "@src/services/memory/types";
import { formatSats, toBitcoin } from "@src/services/converter";
import { useTranslate } from "@src/services/translate";
import { IconNames } from "@src/services/types/icons";
import { Ionicons } from "@expo/vector-icons"
import { styles } from "./style"
import theme from "@src/theme";

type WalletProps = {
    wallet: Wallet,
    showOptions?: () => void
}

export const WalletHeader = ({ wallet, showOptions }: WalletProps) => {

    let balanceSats = formatSats(wallet.lastBalance)
    let balanceBTC = toBitcoin(wallet.lastBalance)
    let formatName = (!!wallet.name && wallet.name?.length >= 28) ? `${wallet.name?.substring(0, 28)}..` : wallet?.name

    let walletColor = wallet.type == "bitcoin" ? theme.colors.orange : theme.colors.blue

    return (
        <>
            {wallet!.type == "bitcoin" && <Image source={require("assets/images/bitcoin-wallet-header3.jpg")} style={{ width: "100%", height: 240 }} />}
            {wallet!.type == "testnet" && <Image source={require("assets/images/bitcoin-wallet-header.jpg")} style={{ width: "100%", height: 240 }} />}
            {wallet!.type == "lightning" && <Image source={require("assets/images/lightning-wallet-header.png")} style={{ width: "100%", height: 240 }} />}
            <View style={styles.headerWallet}>
                <View style={{ height: 50 }}></View>
                <Text style={[{ fontSize: 18 }, styles.headerText]}>{formatName}</Text>
                <Text style={[{ fontSize: 30 }, styles.headerText]}>{balanceSats} Sats</Text>
                <Text style={[{ fontSize: 14 }, styles.headerText]}>{balanceBTC} BTC</Text>
                <Text style={[styles.headerText, { fontSize: 12, backgroundColor: walletColor, padding: 10, borderRadius: 15, maxWidth: 130, textAlign: "center" }]}>
                    {wallet?.type == "bitcoin" && useTranslate("wallet.bitcoin.tag") }
                    {wallet?.type == "testnet" && useTranslate("wallet.bitcoin.testnet.tag")}
                    {wallet?.type == "lightning" && useTranslate("wallet.lightning.tag")}
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

        if (type == "received")
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
                                    <Text style={{ fontSize: 12, color: theme.colors.gray, margin: 2, fontWeight: "bold" }}>
                                        {transaction.confirmed ? transaction.date : '-- -- --'}
                                    </Text>
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

type WalletButtonProps = {
    onSend?: () => void,
    onReceive: (visible: boolean) => void
}

export const WalletButtons = ({ onReceive, onSend }: WalletButtonProps) => {

    return (
        <View style={styles.walletButtonsSection}>
            <View style={{ flexDirection: "row" }}>
                <TouchableOpacity activeOpacity={.7}
                    onPress={() => onReceive(true)}
                    style={[styles.walletActionButton, { borderRightWidth: .2, borderBottomLeftRadius: 15, borderTopLeftRadius: 15 }]}
                >
                    <Ionicons style={{ margin: 5 }} name="enter" color={theme.colors.white} size={theme.icons.medium} />
                    <Text style={styles.walletaAtionText} >{useTranslate("commons.receive")}</Text>

                </TouchableOpacity>
                <TouchableOpacity activeOpacity={.7} onPress={onSend}
                    style={[styles.walletActionButton, { borderLeftWidth: .2, borderBottomRightRadius: 15, borderTopRightRadius: 15 }]}
                >

                    <Text style={styles.walletaAtionText} >{useTranslate("commons.send")}</Text>
                    <Ionicons style={{ margin: 5 }} name="exit" color={theme.colors.white} size={theme.icons.medium} />

                </TouchableOpacity>
            </View>
        </View>
    )
}

