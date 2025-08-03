import { Image, StyleSheet, Text, View } from "react-native";
import { ButtonPrimary } from "@components/form/Buttons";
import { FormControl } from "@components/form/FormControl";
import { useTranslateService } from "@/src/providers/TranslateProvider";
import useRegister from "@/src/hooks/useRegister";
import theme from "@src/theme";

const RegisterScreen = () => {

    const { useTranslate } = useTranslateService()
    const { loading, disabled, userName, setUserName, onRegister } = useRegister()

    return (
        <View style={{ flex: 1 }}>
            <View style={theme.styles.container}>
                <Image style={styles.logo} source={require("@assets/emptio.png")} />

                <Text style={styles.title}>{useTranslate("register.message")}</Text>

                <View style={{ width: "96%" }}>
                    <FormControl value={userName}
                        label={useTranslate("labels.username")} 
                        onChangeText={setUserName}
                    />
                </View>

                <View style={{ height: 100 }}></View>

                <View style={styles.buttonArea}>
                    <ButtonPrimary loading={loading} disabled={disabled}
                        label={useTranslate("commons.signup")} 
                        onPress={onRegister}
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

