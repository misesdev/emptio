import { StyleSheet, View, Text } from "react-native"
import theme from "@src/theme"
import { useEffect, useState } from "react"
import { createHeaderHome } from "../headers"
import SplashScreen from "@components/general/SplashScreen"

const Home = ({ navigation }: any) => {

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        createHeaderHome(navigation)

        navigation.reset({ index: 0})
    }, [])

    if(loading)
        return <SplashScreen />

    return (
        <View style={theme.styles.container} >
            <Text style={styles.title}>Home</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.colors.gray
    }
})

export default Home