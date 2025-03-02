import { useAuth } from "@src/providers/userProvider"
import { TouchableOpacity, View, Text, StyleSheet } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useTranslateService } from "@src/providers/translateProvider"
import { pushMessage } from "@services/notification"
import { Wallet } from "@services/memory/types"
import { StackNavigationProp } from "@react-navigation/stack"
import { ProfilePicture } from "@components/nostr/user/ProfilePicture"
import theme from "@src/theme"

type Props = {
    navigation: StackNavigationProp<any>
}

export const HeaderHome = ({ navigation }: Props) => {

    const { user, wallets } = useAuth()
    const { useTranslate } = useTranslateService()

    const goToDonate = (items: Wallet[]) => {
        if(!items.length)
            return  pushMessage(useTranslate("message.wallet.alertcreate")) 

        let wallet = items.filter(w => w.default).length ? items.filter(w => w.default)[0] : items[0]

        navigation.navigate("user-donate-stack", { wallet })
    }

    return (
        <View style={styles.header}>
            <View style={{ width: "15%", alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity onPress={() => navigation.navigate("user-menu-stack")}>
                    <ProfilePicture user={user} size={38} withBorder={false} />
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
            {/* <View style={{ width: "13%", alignItems: "center", justifyContent: "center" }}> */}
            {/*     <TouchableOpacity onPress={() => navigation.navigate("add-follow-stack")}> */}
            {/*         <Ionicons name="person-add-sharp" color={theme.colors.gray} size={theme.icons.large} /> */}
            {/*     </TouchableOpacity> */}
            {/* </View> */}
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
