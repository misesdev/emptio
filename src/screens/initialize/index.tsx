import { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { ButtonPrimary } from "@components/form/Buttons";
import { hasHardwareAsync, authenticateAsync } from 'expo-local-authentication';
import theme from "@src/theme";

const Authenticate = ({ navigation }: any) => {

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
        const { success } = await authenticateAsync({
            promptMessage: 'Authenticate yourself using biometrics',
        })

        if (success)
            navigation.reset({ index: 0, routes: [{ name: "core-stack" }] })
    };

    if (!biometrics)
        navigation.reset({ index: 0, routes: [{ name: "core-stack" }] })

    return (
        <View style={theme.styles.container}>
            <Image style={styles.logo} source={require("@assets/emptio.png")} />

            <View style={styles.buttonArea}>
                <ButtonPrimary title="Authenticate" onPress={checkBiometricAvailability} />
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