import { View, Text, TouchableOpacity, Image } from "react-native";
import { IconNames } from "@services/types/icons";
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Wallet } from "@services/wallet/types/Wallet";
import { useTranslateService } from "@/src/providers/TranslateProvider";
import { Formatter } from "@services/converter/Formatter";
import { BTransaction } from "@services/wallet/types/Transaction";
import { useService } from "@/src/providers/ServiceProvider";
import { useEffect, useState } from "react";
import { styles } from "./style"
import theme from "@src/theme";

interface WalletProps {
    wallet: Wallet,
    showOptions?: () => void
}

export const WalletHeader = ({ wallet, showOptions }: WalletProps) => {

    const { useTranslate } = useTranslateService()
    let balanceSats = Formatter.formatSats(wallet.lastBalance??0)
    let balanceBTC = Formatter.satsToBitcoin(wallet.lastBalance??0)
    let formatName = (!!wallet.name && wallet.name?.length >= 28) ? 
        `${wallet.name?.substring(0, 28)}..` : wallet?.name
    let walletColor = wallet.network == "mainnet" ? theme.colors.orange : theme.colors.blue

    return (
        <>
            {wallet!.network == "mainnet" && <Image source={require("@assets/images/bitcoin-wallet-header3.jpg")} style={{ width: "100%", height: 240 }} />}
            {wallet!.network == "testnet" && <Image source={require("@assets/images/bitcoin-wallet-header.jpg")} style={{ width: "100%", height: 240 }} />}
            {/* {wallet!.network == "lightning" && <Image source={require("@assets/images/lightning-wallet-header.png")} style={{ width: "100%", height: 240 }} />} */}
            <View style={styles.headerWallet}>
                <View style={{ height: 50 }}></View>
                <Text style={[{ fontSize: 18 }, styles.headerText]}>{formatName}</Text>
                <Text style={[{ fontSize: 30 }, styles.headerText]}>{balanceSats} Sats</Text>
                <Text style={[{ fontSize: 14 }, styles.headerText]}>{balanceBTC} BTC</Text>
                <Text style={[styles.headerText, { fontSize: 12, backgroundColor: walletColor, padding: 10, borderRadius: 10, maxWidth: 130, textAlign: "center" }]}>
                    {wallet?.network == "mainnet" && useTranslate("wallet.bitcoin.tag") }
                    {wallet?.network == "testnet" && useTranslate("wallet.bitcoin.testnet.tag") }
                    {/* {wallet?.network == "lightning" && useTranslate("wallet.lightning.tag") } */}
                </Text>
            </View>
        </>
    )
}

interface WalletTransactionsProps {
    transactions: BTransaction[],
    onPressTransaction: (transaction: BTransaction) => void
}

export const WalletTransactions = ({ transactions, onPressTransaction }: WalletTransactionsProps) => {

    const { walletService } = useService()
    const { useTranslate } = useTranslateService()
    const [blockHeight, setBlockHeight] = useState<number>()

    useEffect(() => {
        walletService.getBlockHeight().then(result => {
            if(result.success) setBlockHeight(result.data??undefined)
        })
    }, [])

    const AmmountText = ({ type, value }: Pick<BTransaction, 'type'|'value'>) => {

        let operator = type == "received" ? "+" : "-"
        let ammountSatoshis = operator + Formatter.formatSats(value)
        let color = type == "received" ? theme.colors.green : theme.colors.red

        return <Text style={{ color: color, margin: 2, fontWeight: "bold" }}>
            {ammountSatoshis}
        </Text>
    }

    const TransactionIcon = ({ type, confirmed }: Pick<BTransaction, 'type'|'confirmed'>) => {

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
                                        {transaction.confirmed && blockHeight && 
                                            `${blockHeight-transaction.block_height} ${useTranslate("wallet.transaction.confirmations")}`
                                        }
                                        {!transaction.confirmed &&
                                            `${useTranslate("wallet.transaction.notconfirmed")}`
                                        }
                                    </Text>
                                </View>
                                <View style={{ width: "100%" }}>
                                    <Text style={{ fontSize: 12, color: theme.colors.gray, margin: 2, fontWeight: "bold" }}>
                                        {transaction.confirmed ? transaction.block_time : '-- -- --'}
                                    </Text>
                                </View>
                            </View>
                            {/* Transaction Ammount */}
                            <View style={{ width: "32%", minHeight: 75, justifyContent: "center", alignItems: "center" }}>
                                <AmmountText type={transaction.type} value={transaction.value} />
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

interface WalletButtonProps {
    onSend?: () => void,
    onReceive: (visible: boolean) => void
}

export const WalletButtons = ({ onReceive, onSend }: WalletButtonProps) => {

    const { useTranslate } = useTranslateService()

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

