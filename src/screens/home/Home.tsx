import { StyleSheet, View, Text } from "react-native"
import theme from "@src/theme"
import { useEffect } from "react"
import { Ionicons } from "@expo/vector-icons"
import SearchButton from "@components/form/SearchButton"

const Home = ({ navigation }: any) => {

    useEffect(() => {
        navigation.setOptions({
            headerTitle: () => <SearchButton label="Pesquisar"/>,
            headerLeft: () => <Ionicons name="menu" color={theme.COLORS.WHITE} size={26} style={{ margin: 16 }} />,
            headerRight: () => <Ionicons name="time" color={theme.COLORS.WHITE} size={26} style={{ margin: 16 }} />,
        })
    }, [])

    return (
        <View style={styles.container} >
            <Text style={styles.title}>Home</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.COLORS.BLACK
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.COLORS.WHITE
    }
})

export default Home