import { useState } from "react";
import SplashScreen from "@components/general/SplashScreen";
import { Image, StyleSheet, Text, View } from "react-native";
import { ButtonPrimary } from "@components/form/Buttons";
import { TextBox } from "@components/form/TextBoxs";
import MessageBox, { showMessage } from "@components/general/MessageBox";
import { SignUp } from "@src/services/userManager";
import { useTranslate } from "@src/services/translate";
import { useAuth } from "@/src/providers/userProvider";
import theme from "@src/theme";

const RegisterScreen = ({ navigation }: any) => {

    const { setUser } = useAuth()
    const [userName, setUserName] = useState("")
    const [loading, setLoading] = useState(false)

    const handlerRegister = async () => {
        if (userName) {

            if (userName.length <= 5)
                return showMessage({ message: "Ops, parece que o nome de usuário é muito curto, por favor digite um nome de usuário com mais caracteres!" })

            setLoading(true)
            setTimeout(async () => {
                
                const result = await SignUp(userName, user => setUser(user))

                if (result.success)
                    return navigation.reset({ index: 0, routes: [{ name: "core-stack" }] })
                else {
                    showMessage({ message: `Ocorreu um erro inesperado durante a regisição: ${result.message}` })
                    setLoading(false)
                }
            }, 100)
        }
    }

    if (loading)
        return <SplashScreen message="registering.." />

    return (
        <>
            <View style={theme.styles.container}>
                <Image style={styles.logo} source={require("@assets/emptio.png")} />

                <Text style={styles.title}>{useTranslate("register.message")}</Text>

                <TextBox placeholder={useTranslate("labels.username")} value={userName} onChangeText={setUserName} />

                <View style={styles.buttonArea}>
                    <ButtonPrimary label={useTranslate("commons.signup")} onPress={handlerRegister} />
                </View>
            </View>
            <MessageBox />
        </>
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

export default RegisterScreen

