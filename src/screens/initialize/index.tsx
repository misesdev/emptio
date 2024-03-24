import { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { ButtonPrimary } from "@components/form/Buttons";
import * as LocalAuthentication from 'expo-local-authentication';
import InitializeRoutes from "@src/routes/login";
import { getUser } from "@src/services/memory";
import theme from "@src/theme";
import AppRoutes from "@src/routes";

const Authenticate = () => {

    const [logged, setLogged] = useState(false)
    const [authenticated, setAuthenticated] = useState(false)
    const [biometrics, setBiometrics] = useState(true)

    const handleLoadData = async () => {

        const { publicKey } = getUser()

        if (publicKey)
            setLogged(true)

        await checkBiometricAvailability()
    }

    useEffect(() => {
        if (logged)
            handleLoadData()
    }, [])

    const checkBiometricAvailability = async () => {
        const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync()

        if (isBiometricAvailable)
            return authenticateWithBiometrics()

        setBiometrics(isBiometricAvailable)
    };

    const authenticateWithBiometrics = async () => {
        const { success } = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Authenticate yourself using biometrics',
        })

        setAuthenticated(success)
    };

    if (!logged)
        return <InitializeRoutes />

    if (logged && (authenticated || !biometrics))
        return <AppRoutes />

    return (
        <View style={theme.styles.container}>
            <Image style={styles.logo} source={require("@assets/emptio.png")} />

            <View style={styles.buttonArea}>
                <ButtonPrimary title="Authenticate" onPress={handleLoadData} />
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

export default Authenticate