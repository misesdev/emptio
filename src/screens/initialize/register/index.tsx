import { useState } from "react";
import SplashScreen from "@components/general/SplashScreen";
import { Image, StyleSheet, Text, View } from "react-native";
import { ButtonPrimary } from "@components/form/Buttons";
import { TextBox } from "@components/form/TextBoxs";
import MessageBox, { showMessage } from "@components/general/MessageBox";
import { userService } from "@/src/core/userManager";
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
                return showMessage({ message: useTranslate("message.profile.alertname") })

            setLoading(true)
            setTimeout(async () => {

                const result = await userService.signUp({ userName, setUser })

                if (result.success)
                    return navigation.reset({ index: 0, routes: [{ name: "core-stack" }] })
                else {
                    showMessage({ message: `${useTranslate("message.request.error")} ${result.message}` })
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

                <View style={{ height: 100 }}></View>

                <View style={styles.buttonArea}>
                    <ButtonPrimary label={useTranslate("commons.signup")} onPress={handlerRegister} />
                </View>
            </View>
            <MessageBox />
        </>
    )
}

const styles = StyleSheet.create({
    logo: { width: 200, height: 200 },
    title: { marginVertical: 10, color: theme.colors.gray, textAlign: "center", width: "85%" },
    buttonArea: { width: '100%', position: 'absolute', justifyContent: 'center', marginVertical: 30, flexDirection: "row", bottom: 10 }
})

export default RegisterScreen

