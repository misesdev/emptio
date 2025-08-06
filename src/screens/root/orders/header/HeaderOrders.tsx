import SearchButton from "@components/form/SearchButton"
import { TouchableOpacity, View, StyleSheet } from "react-native"
import { useTranslateService } from "@src/providers/TranslateProvider"
import { ProfilePicture } from "@components/nostr/user/ProfilePicture"
import { useAccount } from "@src/context/AccountContext"
import theme from "@src/theme"

const HeaderOrders = ({ navigation }: any) => {

    const { user } = useAccount()
    const { useTranslate } = useTranslateService()

    return (
        <View style={styles.header}>
            <View style={{ width: "15%", alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity onPress={() => navigation.navigate("user-menu")}>
                    <ProfilePicture user={user} size={34} withBorder={false} />
                </TouchableOpacity>
            </View>
            <View style={{ width: "70%", alignItems: "center", justifyContent: "center" }}>
                <SearchButton label={useTranslate("commons.search")} onPress={() => navigation.navigate("search-orders")} />
            </View>
            {/* <View style={{ width: "15%", alignItems: "center", justifyContent: "center" }}> */}
            {/*     <TouchableOpacity onPress={() => navigation.navigate("user-menu-stack")}> */}
            {/*         <Ionicons name="documents" color={theme.colors.gray} size={theme.icons.extra} /> */}
            {/*     </TouchableOpacity> */}
            {/* </View> */}
        </View>
    )
}

const styles = StyleSheet.create({
    header: { width: "100%", flexDirection: "row", paddingVertical: 5,
        backgroundColor: theme.colors.black },
    userMenu: { width: 38, height: 38, borderWidth: 1, borderRadius: 50 }
})

export default HeaderOrders
