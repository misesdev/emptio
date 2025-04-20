import { walletService } from "@services/wallet"
import { formatSats, toBitcoin } from "@services/converter"
import { Wallet } from "@services/memory/types"
import { useEffect, useRef, useState } from "react"
import { TouchableOpacity, View, Text, StyleSheet, 
    Image, ViewStyle } from "react-native"
import { ActivityIndicator } from "react-native-paper"
import { getClipedContent, getDescriptionTypeWallet } from "@src/utils"
import { useTranslateService } from "@src/providers/translateProvider"
import theme from "@src/theme"
import { useAuth } from "@src/providers/userProvider"
import { storageService } from "@services/memory"

interface Props {
    wallet: Wallet,
    style: ViewStyle,
    handleOpen: (wallet: Wallet) => void
}

const WalletListItem = ({ wallet, handleOpen, style }: Props) => {
  
    const isFetching = useRef<boolean>(false)
    const { wallets } = useAuth()
    const { useTranslate } = useTranslateService()
    const [loading, setLoading] = useState<boolean>()
    const [typeWallet, setTypeWallet] = useState<string>("")
    const [walletData, setWalletData] = useState(wallet)

    useEffect(() => { 
        setTimeout(loadData, 20)
        getDescriptionTypeWallet(wallet.type ?? "bitcoin").then(setTypeWallet)
    }, [wallets])

    const loadData = async () => {
        if(!isFetching.current) 
        {
            setLoading(true)
            isFetching.current = true
            let balance = await walletService.getBalance(wallet)
            if(walletData.lastBalance != balance)
            {
                setWalletData(prev => ({ ...prev, lastBalance: balance }))
                setTimeout(async () => await storageService.wallets.update({
                    ...walletData, lastBalance: balance
                }), 20)
            }
            isFetching.current = false
            setLoading(false)
        }
    }

    let formatName = getClipedContent(walletData.name??"", 18)

    return (
        <TouchableOpacity key={wallet.key} activeOpacity={.7} 
            style={[styles.wallet,style]} onPress={() => handleOpen(walletData)}
        >
            {walletData!.type === "bitcoin" && <Image source={require("@assets/images/bitcoin-wallet-header3.jpg")} style={{ position: "absolute", borderRadius: 18, width: "100%", height: "100%" }} />}
            {walletData!.type === "testnet" && <Image source={require("@assets/images/bitcoin-wallet-header.jpg")} style={{ position: "absolute", borderRadius: 18, width: "100%", height: "100%" }} />}
            {walletData!.type === "lightning" && <Image source={require("@assets/images/lightning-wallet-header.png")} style={{ position: "absolute", borderRadius: 18, width: "100%", height: "100%" }} />}
            <View style={{ position: "absolute", width: "100%", height: "100%", borderRadius: 18, backgroundColor: "rgba(0,55,55,.7)" }}></View>

            <Text style={styles.title}>{formatName}</Text>
            <View style={{ flexDirection: "row", width: "100%" }}>
                <Text style={{ marginHorizontal: 10, marginVertical: 6, color: theme.colors.white, fontSize: 18, fontWeight: "bold" }}>
                    {formatSats(walletData.lastBalance)} Sats
                </Text>
                { loading &&
                    <ActivityIndicator size={18} color={theme.colors.white} />    
                }
            </View>
            <View style={{ flexDirection: "row", width: "100%" }}>
                <Text style={[styles.description, { color: theme.colors.white }]}>
                    {toBitcoin(walletData.lastBalance)} BTC
                </Text>
            </View> 
            <TouchableOpacity activeOpacity={.7} 
                style={[styles.button, { backgroundColor: walletData.type == "bitcoin" ? 
                    theme.colors.orange : theme.colors.blue 
                }]} onPress={() => handleOpen(walletData)}
            >
                <Text style={styles.buttonText}> {useTranslate("commons.open")} </Text>
            </TouchableOpacity>

            <Text style={[styles.tagWallet, { backgroundColor:  walletData.type == "bitcoin" ? 
                    theme.colors.orange : theme.colors.blue
                }]}
            >
                {typeWallet}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    wallet: { marginVertical: 10, marginHorizontal: 6, borderRadius: 10 },
    title: { color: theme.colors.white, fontSize: 24, fontWeight: "bold", marginTop: 20,
        marginHorizontal: 10 },
    description: { fontSize: 12, marginHorizontal: 10, marginVertical: 6 },
    button: { margin: 10, maxWidth: 150, paddingVertical: 14, borderRadius: 10 },
    buttonText: { color: theme.colors.white, fontSize: 13, fontWeight: "bold", 
        textAlign: 'center', marginHorizontal: 28 },
    tagWallet: { color: theme.colors.white, margin: 10, borderRadius: 10, fontSize: 10, 
        fontWeight: "bold", paddingHorizontal: 10, paddingVertical: 4, position: "absolute", 
        top: -18, right: 14 }
})

export default WalletListItem
