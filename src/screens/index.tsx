import { useEffect, useState } from "react";
import SplashScreen from "@components/general/SplashScreen";
import { Image, StyleSheet, Text, View } from "react-native";
import theme from "../theme";
import { ButtonDanger, ButtonSuccess } from "../components/form/Buttons";

const Initialize = ({ navigation }: any) => {

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // navigation.

        setLoading(false)
    }, [])

    if (loading)
        return <SplashScreen />

    return (
        <View style={theme.styles.container}>
            <Image style={styles.logo} source={require("@assets/emptio.png")} />

            <Text style={styles.title}>Welcome to emptio!</Text>

            <View style={styles.buttonArea}>
                <ButtonSuccess title="REGISTER" onPress={() => { }} />
                <ButtonDanger title="LOGIN" onPress={() => { }} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    logo: {
        maxWidth: "90%",
        height: "35%",
        marginTop: -100
    },
    title: {
        marginVertical: 10,
        color: theme.colors.gray,
    },
    buttonArea: {
        width: '100%',
        position: 'absolute',        
        justifyContent: 'center',
        marginVertical: 30,
        flexDirection: "row",
        bottom: 10,
    }
})

export default Initialize;