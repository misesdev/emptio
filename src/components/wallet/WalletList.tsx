import { SafeAreaView, TouchableOpacity, View, Text, StyleSheet, Dimensions } from "react-native"
import { showNewWaleltModal } from "@screens/root/wallet/new/NewWalletModal"
import { useTranslateService } from "@src/providers/TranslateProvider"
import WalletListItem from "./WalletListItem"
import { FlatList } from "react-native-gesture-handler"
import { useCallback, useEffect, useState } from "react"
import { Wallet } from "@services/wallet/types/Wallet"
import { StoredItem } from "@storage/types"
import theme from "@src/theme"

export type WalletListProps = {
    wallets: StoredItem<Wallet>[];
    navigation: any;
}

const WalletList = ({ wallets, navigation }: WalletListProps) => {
    const { width } = Dimensions.get("window")
    const itemWidth = width * .82
    const spacing = width * .06

    const { useTranslate } = useTranslateService()
    const [walletList, setWalletList] = useState<StoredItem<Wallet>[]>([])

    useEffect(() => {
        setWalletList([...wallets, { id: "create", entity: {} as Wallet }])
    }, [wallets])

    const handleOpenWallet = useCallback((wallet: Wallet) => {
        navigation.navigate("wallet", { wallet })
    }, [navigation])

    const renderItem = useCallback(({ item }: { item: StoredItem<Wallet> }) => {
        if(item.id === "create")
            return (
                 <View style={[styles.wallet, {width: itemWidth, marginRight: spacing, backgroundColor: theme.colors.section, padding: 5 }]}> 
                    <Text style={styles.title}>
                        {useTranslate("labels.wallet.add")}
                    </Text>
                    <Text style={[styles.description, { color: theme.colors.gray }]}>
                        {useTranslate("message.wallet.create")}
                    </Text> 
                    <TouchableOpacity activeOpacity={.7}
                        style={[styles.button, { backgroundColor: theme.colors.blue }]}
                        onPress={() => showNewWaleltModal()}
                    > 
                        <Text style={styles.buttonText}> 
                            {useTranslate("commons.add")} 
                        </Text>
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
                keyExtractor={(item) => item.id ?? Math.random().toString()}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    scroll: { },
    wallet: { marginVertical: 10, marginHorizontal: 6, borderRadius: theme.design.borderRadius },
    title: { color: theme.colors.white, fontSize: 24, fontWeight: "bold", marginTop: 20, 
        marginHorizontal: 10 },
    description: { fontSize: 12, marginHorizontal: 10, marginVertical: 6 },
    button: { margin: 10, maxWidth: 150, paddingVertical: 14, borderRadius: theme.design.borderRadius },
    buttonText: { color: theme.colors.white, fontSize: 13, fontWeight: "bold", textAlign: 'center',
        marginHorizontal: 28 },
})

export default WalletList
