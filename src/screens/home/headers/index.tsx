import SearchButton from "@components/form/SearchButton"
import { TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import theme from "@/src/theme"

export const createHeaderHome = (navigation: any) => {

    const handleSearch = () => {
        navigation.navigate("search-home")
    }

    navigation.setOptions({
        headerTitle: () => <SearchButton label="Search" onPress={handleSearch} />,
        headerLeft: () => { 
            return <TouchableOpacity onPress={() => { }}>
                <Ionicons name="menu" color={theme.COLORS.GRAY} size={26} style={{ margin: 16 }} />
            </TouchableOpacity>
        },
        headerRight: () => { 
            return <TouchableOpacity onPress={() => { }}>
                <Ionicons name="time" color={theme.COLORS.GRAY} size={26} style={{ margin: 16 }} />
                </TouchableOpacity>
        },
    })
}

export const createHeaderFeed = (navigation: any) => {

    const handleSearch = () => {
        navigation.navigate("search-feed")
    }

    navigation.setOptions({
        headerTitle: () => <SearchButton label="Search" onPress={handleSearch}/>,
        headerLeft: () => { 
            return <TouchableOpacity onPress={() => {  }}>
                <Ionicons name="menu" color={theme.COLORS.GRAY} size={26} style={{ margin: 16 }} />
            </TouchableOpacity>
        },
        headerRight: () => {
            return <TouchableOpacity onPress={() => { }}>
                <Ionicons name="time" color={theme.COLORS.GRAY} size={26} style={{ margin: 16 }} />
            </TouchableOpacity>
        },
    })
}
