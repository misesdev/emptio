import { TouchableOpacity, View, Text, StyleSheet } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { pushMessage } from "@services/notification"
import { ProfilePicture } from "@components/nostr/user/ProfilePicture"
import { Wallet } from "@services/wallet/types/Wallet"
import { StoredItem } from "@src/storage/types"
import { useAccount } from "@src/context/AccountContext"
import { useTranslateService } from "@src/providers/TranslateProvider"
import theme from "@src/theme"

export const HeaderHome = ({ navigation }: any) => {

    const { user, wallets } = useAccount()
    const { useTranslate } = useTranslateService()

    const goToDonate = (items: StoredItem<Wallet>[]) => {
        if(!items.length)
            return  pushMessage(useTranslate("message.wallet.alertcreate")) 

        let wallet = items.find(w => w.entity.default)

        if(!wallet) wallet = items[0]

        navigation.navigate("donate", { id: wallet.id })
    }

    return (
        <View style={styles.header}>
            <View style={{ width: "15%", alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity onPress={() => navigation.navigate("user-menu")}>
                    <ProfilePicture user={user} size={34} withBorder={false} />
                </TouchableOpacity>
            </View>
            <View style={{ width: "70%", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: theme.colors.white, fontSize: 18, fontWeight: "600" }}>
                    {useTranslate("commons.hello")}, {user?.display_name?.substring(0, 15)}
                    {user?.display_name && user?.display_name?.length > 15 && ".."}
                </Text>    
            </View>
            <View style={{ width: "15%", alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity onPress={() => goToDonate(wallets)}>
                    <Ionicons name="heart" color={theme.colors.gray} size={theme.icons.large} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        width: "100%",
        paddingVertical: 5,
        flexDirection: "row",
        backgroundColor: theme.colors.black
    },
    userMenu: { width: 38, height: 38, borderRadius: 50, borderWidth: 1 }
})
