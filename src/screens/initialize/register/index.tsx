import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { ButtonPrimary } from "@components/form/Buttons";
import { useAuth } from "@src/providers/userProvider";
import { useTranslateService } from "@src/providers/translateProvider";
import { pushUserFollows, subscribeUser } from "@services/nostr/pool";
import { FormControl } from "@components/form/FormControl";
import { createFollowEvent, userService } from "@services/user";
import { storageService } from "@services/memory";
import { pushMessage } from "@services/notification";
import { getUserName } from "@src/utils";
import theme from "@src/theme";

const RegisterScreen = ({ navigation }: any) => {

    const { setUser, setFollowsEvent } = useAuth()
    const { useTranslate } = useTranslateService()
    const [userName, setUserName] = useState("")
    const [loading, setLoading] = useState(false)
    const [disabled, setDisabled] = useState(true)

    const setValidateUserName = (value: string) => {
        setDisabled(value.trim().length < 3)
        setUserName(value)
    }

    const handlerRegister = async () => {
        if (userName.trim())
        {
            setLoading(true)
            setDisabled(true)

            const results = await userService.searchUsers({}, userName.trim())
          
            if(results.some(u => getUserName(u).trim() == userName.trim())) {
                setLoading(false)
                setDisabled(false)
                return pushMessage(`${useTranslate("register.already_exists")} ${userName.trim()}`)
            }

            await registerUser()

            setDisabled(false)
            setLoading(false)
        }
    }

    const registerUser = async () => {

        const result = await userService.signUp({ userName: userName.trim(), setUser })

        if (result.success && result.data) 
        {
            subscribeUser(result.data)

            const pairKey = await storageService.pairkeys.get(result.data.keychanges??"")
            
            const followsEvent = createFollowEvent(result.data ?? {}, [
                ["p", result.data.pubkey??""]
            ])

            await pushUserFollows(followsEvent, pairKey)

            if(setFollowsEvent) setFollowsEvent(followsEvent)

            return navigation.reset({ index: 0, routes: [{ name: "core-stack" }] })
        }
        pushMessage(`${useTranslate("message.request.error")} ${result.message}`)
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
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    logo: { maxWidth: "90%", maxHeight: "26%", marginTop: -100 },
    title: { marginVertical: 10, color: theme.colors.gray, textAlign: "center", width: "85%" },
    buttonArea: { width: '100%', position: 'absolute', justifyContent: 'center', marginBottom: 40, 
        flexDirection: "row", bottom: 10 }
})

export default RegisterScreen

