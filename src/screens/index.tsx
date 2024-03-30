import { ButtonDefault, ButtonSuccess } from "@components/form/Buttons"
import { Image, StyleSheet, Text, View } from "react-native"
import SplashScreen from "@components/general/SplashScreen"
import { getNostrInstance } from "../services/nostr/events"
import { useTranslate } from "../services/translate"
import { IsLogged } from "../services/userManager"
import { useEffect, useState } from "react"
import theme from "@src/theme"

const Initialize = ({ navigation }: any) => {

    const [loading, setLoading] = useState(true)

    useEffect(() => {

        handleVerifyLogon()

    }, [])

    const handleVerifyLogon = async () => {

        Nostr = await getNostrInstance()

        if (await IsLogged())
            navigation.reset({ index: 0, routes: [{ name: "authenticate-stack" }] })
        else
            setLoading(false)
    }

    if (loading)
        return <SplashScreen />

    return (
        <View style={theme.styles.container}>
            <Image style={styles.logo} source={require("@assets/emptio.png")} />

            <Text style={styles.title}>{useTranslate("initial.message")}</Text>

            <View style={styles.buttonArea}>
                <ButtonSuccess label={useTranslate("commons.signin")} onPress={() => navigation.navigate("login-stack")} />
                <ButtonDefault label={useTranslate("commons.signup")} onPress={() => navigation.navigate("register-stack")} />
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