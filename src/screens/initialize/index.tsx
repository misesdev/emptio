import { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { ButtonPrimary } from "@components/form/Buttons";
import { hasHardwareAsync, authenticateAsync } from 'expo-local-authentication';
import { useTranslate } from "@src/services/translate";
import SplashScreen from "@components/general/SplashScreen";
import theme from "@src/theme";

const AuthenticateScreen = ({ navigation }: any) => {

    const [loading, setLoading] = useState(true)
    const [biometrics, setBiometrics] = useState(true)

    useEffect(() => {
        checkBiometricAvailability()
    }, [])

    const checkBiometricAvailability = async () => {
        const isBiometricAvailable = await hasHardwareAsync()

        if (isBiometricAvailable)
            return authenticateWithBiometrics()

        setBiometrics(isBiometricAvailable)
    };

    const authenticateWithBiometrics = async () => {
        setLoading(false)
        const { success } = await authenticateAsync({
            promptMessage: useTranslate("commons.authenticate.message"),
        })

        if (success) 
            navigation.reset({ index: 0, routes: [{ name: "core-stack" }] })
    };

    if (!biometrics)
        navigation.reset({ index: 0, routes: [{ name: "core-stack" }] })

    if (loading)
        return <SplashScreen />

    return (
        <View style={theme.styles.container}>
            <Image style={styles.logo} source={require("@assets/emptio.png")} />

            <View style={styles.buttonArea}>
                <ButtonPrimary label={useTranslate("commons.authenticate")} leftIcon="finger-print" onPress={checkBiometricAvailability} />
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
        textAlign: "center",
        width: "85%"
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

export default AuthenticateScreen