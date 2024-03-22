import { useEffect, useState } from "react";
import SplashScreen from "@components/general/SplashScreen";
import { Image, StyleSheet, Text, View } from "react-native";
import { ButtonPrimary } from "@components/form/Buttons";
import theme from "@src/theme";

const Register = ({ navigation }: any) => {

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
                <ButtonPrimary title="REGISTER" onPress={() => { }} />
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

export default Register