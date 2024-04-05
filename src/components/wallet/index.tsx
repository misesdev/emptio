import { View, Text, TouchableOpacity, Image, SafeAreaView, ScrollView, Modal, StatusBar } from "react-native";
import { Transaction, Wallet } from "@src/services/memory/types";
import { formatSats, toBitcoin } from "@src/services/converter";
import { useTranslate } from "@src/services/translate";
import { IconNames } from "@src/services/types/icons";
import { Ionicons } from "@expo/vector-icons"
import QRCode from "react-native-qrcode-svg";
import { styles } from "./style"
import theme from "@src/theme";
import { ButtonPrimary } from "../form/Buttons";
import { setStringAsync } from "expo-clipboard";
import { useEffect, useState } from "react";
import { useAuth } from "@/src/providers/userProvider";

type Props = {
    wallets: Wallet[],
    navigation: any
}

export const WalletList = ({ wallets, navigation }: Props) => {

    const { setWallet } = useAuth()

    const handleOpenWallet = (wallet: Wallet) => {
        
        if (setWallet)
            setWallet(wallet)

        navigation.navigate("wallet-stack")
    }

    return (
        <SafeAreaView style={{ width: "100%", height: 220 }}>
            <ScrollView horizontal>
                {wallets &&
                    wallets.map((wallet, key) => {
                        let balanceSats = formatSats(wallet.lastBalance)
                        let balanceBTC = toBitcoin(wallet.lastBalance)
                        let typyWallet = wallet.type === "bitcoin" ? useTranslate("wallet.bitcoin.tag") : useTranslate("wallet.lightning.tag")
                        return (
                            <TouchableOpacity style={[styles.wallet, { paddingHorizontal: 5 }]} key={key} activeOpacity={1}>
                                {wallet!.type === "bitcoin" && <Image source={require("assets/images/bitcoin-wallet-header3.jpg")} style={{ position: "absolute", borderRadius: 18, width: "100%", height: "100%" }} />}
                                {wallet!.type === "lightning" && <Image source={require("assets/images/lightning-wallet-header.png")} style={{ position: "absolute", borderRadius: 18, width: "100%", height: "100%" }} />}
                                <View style={{ position: "absolute", width: "100%", height: "100%", borderRadius: 18, backgroundColor: "rgba(0,55,55,.7)" }}></View>

                                <Text style={styles.title}>{wallet.name}</Text>
                                <Text style={{ marginHorizontal: 10, marginVertical: 6, color: theme.colors.white, fontSize: 18, fontWeight: "bold" }}>{balanceSats} Sats</Text>
                                <Text style={[styles.description, { color: theme.colors.white }]}>{balanceBTC} BTC</Text>
                                <TouchableOpacity activeOpacity={.7} style={[styles.button, { backgroundColor: theme.colors.orange }]} onPress={() => handleOpenWallet(wallet)}>
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

type ReceiveModalProps = {
    address: string,
    visible: boolean,
    onClose: (visible: boolean) => void,
}

export const WalletReceiveModal = ({ visible, onClose, address }: ReceiveModalProps) => {

    const [valueText, setValueText] = useState<string>(address)

    const handleCopyValue = async () => {

        await setStringAsync(address)

        setValueText(useTranslate("commons.copied"))

        setTimeout(() => setValueText(address), 1000)
    }

    const handleCloseModal = () => {
        onClose(false)
    }

    return (
        <>
            <Modal visible={visible} animationType="slide" style={{ zIndex: 0 }}
                onRequestClose={() => onClose(false)}
            >
                <StatusBar hidden />
                <View style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.black }}>

                    <View style={{ flexDirection: "row", position: "absolute", top: 0, width: "100%" }}>
                        <View style={{ width: "75%", padding: 6 }}>
                            <Text style={{ color: theme.colors.white, fontSize: 20, fontWeight: "bold", margin: 15 }}>
                                {useTranslate("wallet.title.receive")}
                            </Text>
                        </View>
                        <View style={{ width: "25%", padding: 6, flexDirection: "row-reverse" }}>
                            <TouchableOpacity onPress={handleCloseModal} activeOpacity={.7}
                                style={{ borderRadius: 20, padding: 6, backgroundColor: theme.colors.gray, margin: 15 }}
                            >
                                <Ionicons name="close" size={theme.icons.medium} color={theme.colors.white} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ padding: 8, borderRadius: 10, backgroundColor: theme.colors.white, marginVertical: 20 }}>
                        <QRCode
                            size={250}
                            value={address}
                            logoSize={75}
                            logoBorderRadius={12}
                            logo={require("assets/icon.png")}
                            backgroundColor={theme.colors.white}
                        />
                    </View>

                    <TouchableOpacity activeOpacity={.7} onPress={handleCopyValue}
                        style={{ padding: 12, marginVertical: 10, borderRadius: 8, backgroundColor: theme.colors.gray }}
                    >
                        <Text style={{ color: theme.colors.white, fontSize: 10 }}>{valueText}</Text>
                    </TouchableOpacity>

                    <View style={{ position: "absolute", bottom: 10, justifyContent: "center" }}>
                        <ButtonPrimary label={useTranslate("commons.copy")} onPress={handleCopyValue} leftIcon="copy" />
                    </View>
                </View>
            </Modal>
        </>
    )
}