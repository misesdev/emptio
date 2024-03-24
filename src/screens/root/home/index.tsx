import { StyleSheet, View, Text } from "react-native"
import theme from "@src/theme"
import { useEffect, useState } from "react"
import { HeaderHome } from "../headers"
import SplashScreen from "@components/general/SplashScreen"

const Home = ({ navigation }: any) => {

    const [loading, setLoading] = useState(true)

    useEffect(() => {

    }, [])

    // if (loading)
    //     return <SplashScreen />

    return (
        <View style={theme.styles.container} >

            <HeaderHome navigation={navigation} />

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