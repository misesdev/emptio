import { ButtonDefault, ButtonSuccess } from "@components/form/Buttons"
import { Image, StyleSheet, Text, View } from "react-native"
import SplashScreen from "@components/general/SplashScreen"
import { getNostrInstance } from "../services/nostr/events"
import { userService } from "../core/userManager"
import { useEffect, useState } from "react"
import theme from "@src/theme"
import { useAuth } from "../providers/userProvider"
import { emptioService } from "../core/emptio"
import { useTranslateService } from "../providers/translateProvider"

const InitializeScreen = ({ navigation }: any) => {

    const { setUser, setEmptioData } = useAuth()
    const [loading, setLoading] = useState(true)
    const { useTranslate } = useTranslateService()

    useEffect(() => {

        handleVerifyLogon()

    }, [])

    const handleVerifyLogon = async () => {

        Nostr = await getNostrInstance()

        if (await userService.isLogged({ setUser })) {
            if (setEmptioData)
                setEmptioData(await emptioService.getInitalData())

            navigation.reset({ index: 0, routes: [{ name: "authenticate-stack" }] })
        }
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

export default InitializeScreen;