import { SafeAreaView, TouchableOpacity, View, Text, StyleSheet, Dimensions } from "react-native"
import { useTranslateService } from "@src/providers/translateProvider"
import { Wallet } from "@services/memory/types"
import WalletListItem from "./WalletListItem"
import { FlatList } from "react-native-gesture-handler"
import { useCallback, useEffect, useState } from "react"
import theme from "@src/theme"

interface Props {
    wallets: Wallet[],
    navigation: any
}

const WalletList = ({ wallets, navigation }: Props) => {
    const { width } = Dimensions.get("window")
    const itemWidth = width * .82
    const spacing = width * .06

    const { useTranslate } = useTranslateService()
    const [walletList, setWalletList] = useState<Wallet[]>([])

    useEffect(() => {
        setWalletList([...wallets, { key: "create" }])
    }, [wallets])

    const handleOpenWallet = useCallback((wallet: Wallet) => {
        navigation.navigate("wallet", { wallet })
    }, [navigation])

    const renderItem = useCallback(({ item }: { item: Wallet }) => {
        if(item.key === "create")
            return (
                 <View style={[styles.wallet, {width: itemWidth, marginRight: spacing, backgroundColor: theme.colors.section, padding: 5 }]}> 
                     <Text style={styles.title}>{useTranslate("labels.wallet.add")}</Text>
                     <Text style={[styles.description, { color: theme.colors.gray }]}>{useTranslate("message.wallet.create")}</Text> 
                     <TouchableOpacity activeOpacity={.7}
                        style={[styles.button, { backgroundColor: theme.colors.blue }]}
                        onPress={() => navigation.navigate("new-wallet")}
                    > 
                         <Text style={styles.buttonText}> {useTranslate("commons.add")} </Text>
                     </TouchableOpacity> 
                </View>
            )

        return (
            <WalletListItem wallet={item}
                style={{ width: itemWidth, marginRight: spacing }}
                handleOpen={handleOpenWallet} 
            />
        )
    }, [navigation, useTranslate, handleOpenWallet])

    return (
        <SafeAreaView style={{ width: "100%", height: 220 }}>
            <FlatList horizontal pagingEnabled
                data={walletList}
                snapToInterval={itemWidth+spacing}
                renderItem={renderItem}
                contentContainerStyle={{ 
                    marginLeft: -(spacing), 
                    paddingHorizontal: (width - itemWidth) / 2
                }}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.key ?? Math.random().toString()}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    scroll: { },
    wallet: { marginVertical: 10, marginHorizontal: 6, borderRadius: 10 },
    title: { color: theme.colors.white, fontSize: 24, fontWeight: "bold", marginTop: 20, marginHorizontal: 10 },
    description: { fontSize: 12, marginHorizontal: 10, marginVertical: 6 },
    button: { margin: 10, maxWidth: 150, paddingVertical: 14, borderRadius: 10, },
    buttonText: { color: theme.colors.white, fontSize: 13, fontWeight: "bold", textAlign: 'center', marginHorizontal: 28 },
})

export default WalletList
