import { StyleSheet, View, Text } from "react-native"
import theme from "@src/theme"
import { useEffect, useState } from "react"
import { createHeaderHome } from "./headers"
import SplashScreen from "@/src/components/general/SplashScreen"

const Home = ({ navigation }: any) => {

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        createHeaderHome(navigation)
    }, [])

    if(loading)
        return <SplashScreen />

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