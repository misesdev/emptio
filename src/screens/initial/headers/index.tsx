import SearchButton from "@components/form/SearchButton"
import { Image, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import theme from "@src/theme"
import { getUser } from "@/src/services/memory"

export const createHeaderHome = (navigation: any) => {

    const { profile } = getUser()

    const handleMenu = () => navigation.navigate("user-menu-stack")

    const handleSearch = () => navigation.navigate("search-home-stack")

    navigation.setOptions({
        headerTitle: () => <SearchButton label="Search" onPress={handleSearch} />,
        headerLeft: () => { 
            return <TouchableOpacity onPress={handleMenu}>
                { profile && <Image source={{ uri: profile}} style={styles.userMenu} /> }
                { !!!profile && <Ionicons name="person-circle" color={theme.colors.gray} size={theme.icons.extra} style={{ margin: 12 }} /> }
            </TouchableOpacity>
        },
        headerRight: () => { 
            return <TouchableOpacity onPress={() => { }}>
                <Ionicons name="time" color={theme.colors.gray} size={theme.icons.medium} style={{ margin: 16 }} />
                </TouchableOpacity>
        },
    })
}

export const createHeaderFeed = (navigation: any) => {

    const { profile } = getUser()
    
    const handleMenu = () => navigation.navigate("user-menu-stack")

    const handleSearch = () => navigation.navigate("search-feed-stack")

    navigation.setOptions({
        headerTitle: () => <SearchButton label="Search" onPress={handleSearch}/>,
        headerLeft: () => { 
            return <TouchableOpacity onPress={handleMenu}>
                { profile && <Image source={{ uri: profile }} style={styles.userMenu} /> }
                { !!!profile && <Ionicons name="person-circle" color={theme.colors.gray} size={theme.icons.extra} style={{ margin: 12 }} /> }
            </TouchableOpacity>
        },
        headerRight: () => {
            return <TouchableOpacity onPress={() => { }}>
                <Ionicons name="time" color={theme.colors.gray} size={theme.icons.medium} style={{ margin: 16 }} />
            </TouchableOpacity>
        },
    })
}

const styles = StyleSheet.create({
    userMenu: {
        width: 30,
        height: 30,
        margin: 15,
        borderRadius: 20,
        borderColor: theme.colors.gray,
        borderWidth: 1
    }
})