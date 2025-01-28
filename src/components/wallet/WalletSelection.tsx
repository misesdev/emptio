
import { useState } from "react"
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Ionicons from '@react-native-vector-icons/ionicons'
import { Wallet } from "@services/memory/types"
import { useAuth } from "@src/providers/userProvider"
import { formatSats } from "@services/converter"
import theme from "@src/theme"

var showWalletsFunction: () => void

type Props = {
    wallet: Wallet,
    setWallet: (wallet:Wallet) => void,
}

const SelectWalletBox = ({ wallet, setWallet }: Props) => {

    const { wallets } = useAuth()
    const [visible, setVisible] = useState(false)

    showWalletsFunction = () => {
        setVisible(true)
    }

    const changeWallet = (item: Wallet) => {
        if (setWallet)
            setWallet(item)
        setVisible(false)
    }

    const renderWalletOption = (item: Wallet, key: number) => {

        var selected = item.key == wallet.key

        var formatName = (!!item.name && item.name?.length >= 15) ? `${item.name?.substring(0, 13)}..` : item?.name

        return (
            <TouchableOpacity key={key} onPress={() => changeWallet(item)} style={[styles.option]} >
                <View style={{ width: "50%", height: "100%", alignItems: "center" }}>
                    <Text style={styles.labelOption}>{formatName}</Text>
                </View>
                <View style={{ width: "40%", height: "100%", alignItems: "center" }}>
                    <Text style={styles.labelAmount}>{formatSats(item.lastBalance)} sats</Text>
                </View>
                <View style={{ width: "10%", height: "100%", flexDirection: "row-reverse", alignItems: "center" }}>
                    {selected && <Ionicons name="checkmark-circle" size={18} color={theme.colors.green} />}
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <Modal animationType="fade" onRequestClose={() => setVisible(false)} visible={visible} transparent >
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0, .6)" }}>
                <View style={styles.box}>
                    {wallets &&
                        wallets.map((item, key) => renderWalletOption(item, key))
                    }
                </View>
            </View>
        </Modal>
    )
}

export const showSelectWallet = () => {
    setTimeout(() => { showWalletsFunction() }, 10)
}

const styles = StyleSheet.create({
    box: { padding: 10, width: "85%", borderRadius: 8, backgroundColor: theme.colors.section },
    option: { width: "100%", flexDirection: "row", padding: 5, borderRadius: 10, marginVertical: 2 },
    labelOption: { width: "100%", color: theme.colors.white, padding: 10 },
    labelAmount: { width: "100%", color: theme.colors.white, paddingVertical: 12, fontSize: 11, fontWeight: "500" },
    absolute: { position: "absolute", width: "100%", height: "100%", top: 0, left: 0, bottom: 0, right: 0 }
})

export default SelectWalletBox
