import { useAuth } from "@src/providers/userProvider"
import { TouchableOpacity, View, Text, Image, StyleSheet } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'
import SearchButton from "@components/form/SearchButton"
import theme from "@src/theme"
import { useTranslateService } from "@src/providers/translateProvider"
import { pushMessage } from "@services/notification"
import { Wallet } from "@services/memory/types"
import { StackScreenProps } from "@react-navigation/stack"

export const HeaderHome = ({ navigation }: StackScreenProps<any>) => {

    const { user, wallets } = useAuth()
    const { useTranslate } = useTranslateService()

    const toDonate = (items: Wallet[]) => {
        if(!items.length)
            return  pushMessage(useTranslate("message.wallet.alertcreate")) 

        let wallet = items.filter(w => w.default).length ? items.filter(w => w.default)[0] : items[0]

        navigation.navigate("user-donate-stack", { wallet })
    }

    return (
        <View style={styles.header}>
            <View style={{ width: "15%", alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity onPress={() => navigation.navigate("user-menu-stack")}>
                    {user?.picture && <Image source={{ uri: user?.picture }} style={styles.userMenu} />}
                    {!!!user?.picture && <Image source={require("@assets/images/defaultProfile.png")} style={styles.userMenu} />}
                </TouchableOpacity>
            </View>
            <View style={{ width: "60%", alignItems: "center", justifyContent: "center" }}>
                {/* <SearchButton label={useTranslate("commons.search")} onPress={() => navigation.navigate("search-home-stack")} /> */}
                <Text style={{ color: theme.colors.white, fontSize: 18, fontWeight: "600" }}>
                    {useTranslate("commons.hello")}, {user?.display_name?.substring(0, 15)}
                    {user?.display_name && user?.display_name?.length > 15 && ".."}
                </Text>    
            </View>
            <View style={{ width: "12%", alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity onPress={() => toDonate(wallets)}>
                    <Ionicons name="heart" color={theme.colors.gray} size={theme.icons.large} />
                </TouchableOpacity>
            </View>
            <View style={{ width: "13%", alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity onPress={() => navigation.navigate("add-follow-stack")}>
                    <Ionicons name="person-add-sharp" color={theme.colors.gray} size={theme.icons.large} />
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
    userMenu: {
        width: theme.icons.extra,
        height: theme.icons.extra,
        borderRadius: 20,
        borderColor: theme.colors.blue,
        // borderWidth: 2
    }
})
