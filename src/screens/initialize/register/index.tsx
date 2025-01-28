import { useState } from "react";
import SplashScreen from "@components/general/SplashScreen";
import { Image, StyleSheet, Text, View } from "react-native";
import { ButtonPrimary } from "@components/form/Buttons";
import { TextBox } from "@components/form/TextBoxs";
import MessageBox, { showMessage } from "@components/general/MessageBox";
import { userService } from "@src/core/userManager";
import { useAuth } from "@src/providers/userProvider";
import { useTranslateService } from "@src/providers/translateProvider";
import useNDKStore from "@services/zustand/ndk";
import { subscribeUserChat } from "@services/nostr/pool";
import useChatStore from "@services/zustand/chats";
import theme from "@src/theme";

const RegisterScreen = ({ navigation }: any) => {

    const { addChat } = useChatStore()
    const { setNdkSigner } = useNDKStore()
    const { setUser, setFollows } = useAuth()
    const { useTranslate } = useTranslateService()
    const [userName, setUserName] = useState("")
    const [loading, setLoading] = useState(false)

    const handlerRegister = async () => {
        if (userName) {

            if (userName.length <= 5)
                return showMessage({ message: useTranslate("message.profile.alertname") })

            setLoading(true)
            setTimeout(async () => {
                const result = await userService.signUp({ userName, setUser, setFollows })

                if (result.success && result.data) 
                { 
                    setNdkSigner(result.data)
                    subscribeUserChat({ user: result.data, addChat })

                    return navigation.reset({ index: 0, routes: [{ name: "core-stack" }] })
                }
                else {
                    showMessage({ message: `${useTranslate("message.request.error")} ${result.message}` })
                    setLoading(false)
                }
            }, 100)
        }
    }

    if (loading)
        return <SplashScreen message="" />

    return (
        <View style={{ flex: 1 }}>
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
        </View>
    )
}

const styles = StyleSheet.create({
    logo: { maxWidth: "90%", maxHeight: "26%", marginTop: -100 },
    title: { marginVertical: 10, color: theme.colors.gray, textAlign: "center", width: "85%" },
    buttonArea: { width: '100%', position: 'absolute', justifyContent: 'center', marginBottom: 40, flexDirection: "row", bottom: 10 }
})

export default RegisterScreen

