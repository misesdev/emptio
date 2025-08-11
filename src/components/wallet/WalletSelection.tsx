import { useCallback, useState } from "react"
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { StoredItem } from "@src/storage/types"
import { Wallet } from "@services/wallet/types/Wallet"
import { useAccount } from "@src/context/AccountContext"
import { Utilities } from "@src/utils/Utilities"
import { Formatter } from "@services/converter/Formatter"
import theme from "@src/theme"

var showWalletsFunction: () => void

interface Props {
    wallet: StoredItem<Wallet>;
    setWallet: (w: StoredItem<Wallet>) => void;
}

const SelectWalletBox = ({ wallet, setWallet }: Props) => {

    const { wallets } = useAccount()
    const [visible, setVisible] = useState(false)

    showWalletsFunction = useCallback(() => {
        setVisible(true)
    }, [setVisible])

    const changeWallet = (item: StoredItem<Wallet>) => {
        setWallet(item)
        setVisible(false)
    }

    const renderWalletOption = (item: StoredItem<Wallet>, key: number) => {

        var selected = item.id == wallet.id

        return (
            <TouchableOpacity key={key} onPress={() => changeWallet(item)} style={[styles.option]} >
                <View style={{ width: "50%", height: "100%", alignItems: "center" }}>
                    <Text style={styles.labelOption}>{Utilities.getClipedContent(item.entity.name??"", 15)}</Text>
                </View>
                <View style={{ width: "40%", height: "100%", alignItems: "center" }}>
                    <Text style={styles.labelAmount}>{Formatter.formatSats(item.entity.lastBalance??0)} sats</Text>
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
    box: { padding: 10, width: "85%", borderRadius: theme.design.borderRadius, 
        backgroundColor: theme.colors.section },
    option: { width: "100%", flexDirection: "row", padding: 5, borderRadius: theme.design.borderRadius, 
        marginVertical: 2 },
    labelOption: { width: "100%", color: theme.colors.white, padding: 10 },
    labelAmount: { width: "100%", color: theme.colors.white, paddingVertical: 12, 
        fontSize: 11, fontWeight: "500" },
    absolute: { position: "absolute", width: "100%", height: "100%", top: 0, left: 0, 
        bottom: 0, right: 0 }
})

export default SelectWalletBox
