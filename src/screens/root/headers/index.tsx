import { Image, StyleSheet, TouchableOpacity, View } from "react-native"
import SearchButton from "@components/form/SearchButton"
import { useTranslate } from "@src/services/translate"
import { getUser } from "@src/services/memory/user"
import { Ionicons } from "@expo/vector-icons"
import { useEffect, useState } from "react"
import theme from "@src/theme"

export const HeaderHome = ({ navigation }: any) => {

    const [picture, setPicture] = useState<string>()

    useEffect(() => { handleLoadUserInfo() }, [])

    const handleLoadUserInfo = async () => {
        const { picture } = await getUser()
        setPicture(picture)
    }

    return (
        <View style={styles.header}>
            <View style={{ width: "15%", alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity onPress={() => navigation.navigate("user-menu-stack")}>
                    {picture && <Image source={{ uri: picture }} style={styles.userMenu} />}
                    {!!!picture && <Image source={require("assets/images/defaultProfile.png")} style={styles.userMenu} />}
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
                <TouchableOpacity onPress={() => navigation.navigate("user-menu-stack")}>
                    <Ionicons name="notifications-circle" color={theme.colors.gray} size={theme.icons.extra} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export const HeaderFeed = ({ navigation }: any) => {

    const [picture, setPicture] = useState<string>()

    useEffect(() => { handleLoadUserInfo() }, [])

    const handleLoadUserInfo = async () => {
        const { picture, name, banner } = await getUser()
        setPicture(picture)
    }
    
    return (
        <View style={styles.header}>
            <View style={{ width: "15%", alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity onPress={() => navigation.navigate("user-menu-stack")}>
                    {picture && <Image source={{ uri: picture }} style={styles.userMenu} />}
                    {!picture && <Image source={require("assets/images/defaultProfile.png")} style={styles.userMenu} />}
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