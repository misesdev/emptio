import { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { ButtonPrimary } from "@components/form/Buttons";
import SplashScreen from "@components/general/SplashScreen";
import { useSettings } from "@src/providers/settingsProvider";
import { useTranslateService } from "@src/providers/translateProvider";
import { authService } from "@src/core/authManager";
import theme from "@src/theme";

const AuthenticateScreen = ({ navigation }: any) => {

    const { settings } = useSettings()
    const { useTranslate } = useTranslateService()
    const [loading, setLoading] = useState(true)
    const [biometrics, setBiometrics] = useState(true)

    useEffect(() => {
        checkBiometric().then(() => setLoading(false))
    }, [settings])

    const checkBiometric = async () => {
        if (settings.useBiometrics)
            await authenticateWithBiometrics()
        else
            navigation.reset({ index: 0, routes: [{ name: "core-stack" }] })
    }

    const authenticateWithBiometrics = async () => {
        const success = await authService.checkBiometric() 
        if (success)
            navigation.reset({ index: 0, routes: [{ name: "core-stack" }] })

        setBiometrics(success)
    }

    if (!biometrics)
        navigation.reset({ index: 0, routes: [{ name: "core-stack" }] })

    if (loading)
        return <SplashScreen />

    return (
        <View style={theme.styles.container}>
            <Image style={styles.logo} source={require("@assets/emptio.png")} />

            <View style={styles.buttonArea}>
                <ButtonPrimary label={useTranslate("commons.authenticate")} leftIcon="finger-print" onPress={authenticateWithBiometrics} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    logo: { maxWidth: "60%", height: "25%", marginTop: -100 },
    title: { marginVertical: 10, color: theme.colors.gray, textAlign: "center", width: "85%" },
    buttonArea: { width: '100%', position: 'absolute', justifyContent: 'center', marginVertical: 30, flexDirection: "row", bottom: 10 }
})

export default AuthenticateScreen
