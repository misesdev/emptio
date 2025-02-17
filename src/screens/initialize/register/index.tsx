import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { ButtonPrimary } from "@components/form/Buttons";
import MessageBox, { showMessage } from "@components/general/MessageBox";
import { createFollowEvent, userService } from "@src/core/userManager";
import { useAuth } from "@src/providers/userProvider";
import { useTranslateService } from "@src/providers/translateProvider";
import useChatStore from "@services/zustand/chats";
import { pushUserFollows, subscribeUser } from "@services/nostr/pool";
import { FormControl } from "@components/form/FormControl";
import theme from "@src/theme";
import { getPairKey } from "@/src/services/memory/pairkeys";

const RegisterScreen = ({ navigation }: any) => {

    const { addChat } = useChatStore()
    const { setUser, setFollowsEvent } = useAuth()
    const { useTranslate } = useTranslateService()
    const [userName, setUserName] = useState("")
    const [loading, setLoading] = useState(false)
    const [disabled, setDisabled] = useState(true)

    const setValidateUserName = (value: string) => {
        setDisabled(value.length < 5)
        setUserName(value)
    }

    const handlerRegister = async () => {
        if (userName)
        {
            setLoading(true)
            setDisabled(true)
            setTimeout(async () => {
                const result = await userService.signUp({ userName, setUser })

                if (result.success && result.data) 
                {
                    subscribeUser({ user: result.data, addChat })

                    const pairKey = await getPairKey(result.data.keychanges??"")
                    
                    const followsEvent = createFollowEvent(result.data ?? {}, [
                        ["p", result.data.pubkey??""]
                    ])

                    await pushUserFollows(followsEvent, pairKey)

                    if(setFollowsEvent) setFollowsEvent(followsEvent)

                    return navigation.reset({ index: 0, routes: [{ name: "core-stack" }] })
                }
                else {
                    showMessage({ message: `${useTranslate("message.request.error")} ${result.message}` })
                    setDisabled(false)
                    setLoading(false)
                }
            }, 20)
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={theme.styles.container}>
                <Image style={styles.logo} source={require("@assets/emptio.png")} />

                <Text style={styles.title}>{useTranslate("register.message")}</Text>

                <View style={{ width: "96%" }}>
                    <FormControl value={userName}
                        label={useTranslate("labels.username")} 
                        onChangeText={setValidateUserName}
                    />
                </View>

                <View style={{ height: 100 }}></View>

                <View style={styles.buttonArea}>
                    <ButtonPrimary loading={loading} disabled={disabled}
                        label={useTranslate("commons.signup")} 
                        onPress={handlerRegister}
                        style={{ backgroundColor: disabled ? theme.colors.disabled
                            : theme.colors.blue
                        }}
                    />
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

