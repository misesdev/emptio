import { StyleSheet, View, Text } from "react-native"
import theme from "@src/theme"
import { useEffect } from "react"
import { Ionicons } from "@expo/vector-icons"

const Home = ({ navigation }: any) => {

    useEffect(() => {
        navigation.setOptions({
            headerTitle: () => <Ionicons name="home" color={theme.COLORS.WHITE} size={26} style={{ margin: 15 }} />,
            headerLeft: () => <Ionicons name="menu" color={theme.COLORS.WHITE} size={26} style={{ margin: 15 }} />,
            headerRight: () => <Ionicons name="bug" color={theme.COLORS.WHITE} size={26} style={{ margin: 15 }} />,
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