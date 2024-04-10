import { Image, StyleSheet, TouchableOpacity, View } from "react-native"
import SearchButton from "@components/form/SearchButton"
import { useTranslate } from "@src/services/translate"
import { useAuth } from "@src/providers/userProvider"
import { Ionicons } from "@expo/vector-icons"
import theme from "@src/theme"

export const HeaderHome = ({ navigation }: any) => {

    const { user } = useAuth()

    return (
        <View style={styles.header}>
            <View style={{ width: "15%", alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity onPress={() => navigation.navigate("user-menu-stack")}>
                    {user?.picture && <Image source={{ uri: user?.picture }} style={styles.userMenu} />}
                    {!!!user?.picture && <Image source={require("assets/images/defaultProfile.png")} style={styles.userMenu} />}
                </TouchableOpacity>
            </View>
            <View style={{ width: "55%", alignItems: "center", justifyContent: "center" }}>
                <SearchButton label={useTranslate("commons.search")} onPress={() => navigation.navigate("search-home-stack")} />
            </View>
            <View style={{ width: "15%", alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity onPress={() => navigation.navigate("user-menu-stack")}>
                    <Ionicons name="pie-chart" color={theme.colors.gray} size={theme.icons.extra} />
                </TouchableOpacity>
            </View>
            <View style={{ width: "15%", alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity onPress={() => navigation.navigate("add-follow-stack")}>
                    <Ionicons name="person-add" color={theme.colors.gray} size={theme.icons.extra} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export const HeaderFeed = ({ navigation }: any) => {

    const { user } = useAuth()
    
    return (
        <View style={styles.header}>
            <View style={{ width: "15%", alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity onPress={() => navigation.navigate("user-menu-stack")}>
                    {user?.picture && <Image source={{ uri: user?.picture }} style={styles.userMenu} />}
                    {!user?.picture && <Image source={require("assets/images/defaultProfile.png")} style={styles.userMenu} />}
                </TouchableOpacity>
            </View>
            <View style={{ width: "70%", alignItems: "center", justifyContent: "center" }}>
                <SearchButton label={useTranslate("commons.search")} onPress={() => navigation.navigate("search-feed-stack")} />
            </View>
            <View style={{ width: "15%", alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity onPress={() => navigation.navigate("user-menu-stack")}>
                    <Ionicons name="chatbubble" color={theme.colors.gray} size={theme.icons.extra} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        width: "100%",
        flexDirection: "row",
        paddingVertical: 5,
        backgroundColor: theme.colors.black
    },
    userMenu: {
        width: theme.icons.extra,
        height: theme.icons.extra,
        borderRadius: 20,
        borderColor: theme.colors.gray,
        borderWidth: 1
    }
})