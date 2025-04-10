import MessageBox from "@components/general/MessageBox";
import { Image, StyleSheet, Text, View } from "react-native";
import { QRCodeTextBox } from "@components/form/TextBoxs";
import { ButtonPrimary } from "@components/form/Buttons";
import { useTranslateService } from "@src/providers/translateProvider";
import { useLogin } from "../../hooks/use-login";
import theme from "@src/theme";

const LoginScreen = ({ navigation }: any) => {

    const { useTranslate } = useTranslateService()
    const { loading, disabled, secretKey, setSecretKey, login } = useLogin({ navigation })

    return (
        <View style ={{ flex: 1 }}>
            <View style={theme.styles.container}>

                <Image style={styles.logo} source={require("@assets/emptio.png")} />

                <Text style={styles.title}>{useTranslate("login.message")}</Text>

                <QRCodeTextBox value={secretKey}
                    placeholder={useTranslate("labels.privatekey")} 
                    onChangeText={setSecretKey}
                />

                <View style={{ height: 100 }}></View>
                
                <View style={styles.buttonArea}>
                    <ButtonPrimary disabled={disabled} loading={loading}
                        label={useTranslate("commons.signin")} 
                        onPress={login} 
                    />
                </View>
            </View>
            <MessageBox />
        </View>
    )
}

const styles = StyleSheet.create({
    logo: { maxWidth: "90%", maxHeight: "26%", marginTop: -100 },
    title: { marginVertical: 25, color: theme.colors.gray, textAlign: "center", width: "85%" },
    buttonArea: { width: '100%', position: 'absolute', justifyContent: 'center', marginBottom: 40, flexDirection: "row", bottom: 10 }
})

export default LoginScreen
