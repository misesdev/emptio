import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { QRCodeTextBox } from "@components/form/TextBoxs";
import { ButtonPrimary } from "@components/form/Buttons";
import * as ClipBoard from 'expo-clipboard'
import theme from "@src/theme";
import { useTranslate } from "@src/services/translate";
import SplashScreen from "@/src/components/general/SplashScreen";

const Login = ({ navigation }: any) => {

    const [loading, setLoading] = useState(false)
    const [privateKey, setPrivateKey] = useState("")

    useEffect(() => {
        // verify clipboard for a privateKey nostr
        ClipBoard.getStringAsync().then((clipboardString) => {
            if (clipboardString.substring(0, 4) === "nsec") {
                handlerClipboard(clipboardString)
            }
        })
    }, [])

    const handlerClipboard = (key: string) => {

    }

    const handlerLogin = () => {
        setLoading(true)

        setTimeout(() => {

            // pos sign in
            navigation.reset({ index: 0, routes:[{ name: "core-stack" }] })
        }, 300)
    }

    if(loading)
        return <SplashScreen message={useTranslate("commons.signin")}/>

    return (
        <View style={theme.styles.container}>
            <Image style={styles.logo} source={require("@assets/emptio.png")} />

            <Text style={styles.title}>{useTranslate("login.message")}</Text>

            <QRCodeTextBox placeholder={useTranslate("labels.privatekey")} onChangeText={setPrivateKey} value={privateKey} />

            <View style={styles.buttonArea}>
                <ButtonPrimary label={useTranslate("commons.signin")} onPress={handlerLogin} />
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
        marginVertical: 25,
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

export default Login