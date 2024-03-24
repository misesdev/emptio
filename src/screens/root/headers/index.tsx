import SearchButton from "@components/form/SearchButton"
import { Image, StyleSheet, TouchableOpacity, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import theme from "@src/theme"
import { getUser } from "@/src/services/memory"

export const HeaderHome = ({ navigation }: any) => {

    const { profile } = getUser()

    const handleMenu = () => navigation.navigate("user-menu-stack")

    const handleSearch = () => navigation.navigate("search-home-stack")

    return (
        <View style={styles.header}>
            <View style={{ width: "15%", alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity onPress={handleMenu}>
                    {profile && <Image source={{ uri: profile }} style={styles.userMenu} />}
                    {!!!profile && <Ionicons name="person-circle" color={theme.colors.gray} size={theme.icons.extra} />}
                </TouchableOpacity>
            </View>
            <View style={{ width: "55%", alignItems: "center", justifyContent: "center" }}>
                <SearchButton label="Search" onPress={handleSearch} />
            </View>
            <View style={{ width: "15%", alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity onPress={handleMenu}>
                    {profile && <Image source={{ uri: profile }} style={styles.userMenu} />}
                    {!!!profile && <Ionicons name="pie-chart" color={theme.colors.gray} size={theme.icons.extra} />}
                </TouchableOpacity>
            </View>
            <View style={{ width: "15%", alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity onPress={handleMenu}>
                    {profile && <Image source={{ uri: profile }} style={styles.userMenu} />}
                    {!!!profile && <Ionicons name="notifications-circle" color={theme.colors.gray} size={theme.icons.extra} />}
                </TouchableOpacity>
            </View>
        </View>
    )
}

export const HeaderFeed = ({ navigation }: any) => {

    const { profile } = getUser()

    const handleMenu = () => navigation.navigate("user-menu-stack")

    const handleSearch = () => navigation.navigate("search-feed-stack")

    return (
        <View style={styles.header}>
            <View style={{ width: "15%", alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity onPress={handleMenu}>
                    {profile && <Image source={{ uri: profile }} style={styles.userMenu} />}
                    {!!!profile && <Ionicons name="person-circle" color={theme.colors.gray} size={theme.icons.extra} />}
                </TouchableOpacity>
            </View>
            <View style={{ width: "70%", alignItems: "center", justifyContent: "center" }}>
                <SearchButton label="Search" onPress={handleSearch} />
            </View>
            <View style={{ width: "15%", alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity onPress={handleMenu}>
                    {profile && <Image source={{ uri: profile }} style={styles.userMenu} />}
                    {!!!profile && <Ionicons name="chatbubble" color={theme.colors.gray} size={theme.icons.extra} />}
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        top: 0,
        width: "100%",
        flexDirection: "row",
        position: "absolute",
        paddingVertical: 10
    },
    userMenu: {
        width: 30,
        height: 30,
        margin: 15,
        borderRadius: 20,
        borderColor: theme.colors.gray,
        borderWidth: 1
    }
})