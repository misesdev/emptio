import { ButtonDefault, ButtonSuccess } from "@components/form/Buttons"
import { Image, StyleSheet, Text, View } from "react-native"
import SplashScreen from "@components/general/SplashScreen"
import { useTranslateService } from "../providers/translateProvider"
import { useInitialize } from "./hooks/use-initialize"
import theme from "@src/theme"

const InitializeScreen = ({ navigation }: any) => {

    const { useTranslate } = useTranslateService()
    const { loading } = useInitialize({ navigation })

    if (loading)
        return <SplashScreen />

    return (
        <View style={theme.styles.container}>
            <Image style={styles.logo} source={require("@assets/emptio.png")} />

            <Text style={styles.title}>{useTranslate("initial.message")}</Text>

            <View style={styles.buttonArea}>
                <ButtonSuccess 
                    label={useTranslate("commons.signin")} 
                    onPress={() => navigation.navigate("login-stack")} 
                />
                <ButtonDefault 
                    label={useTranslate("commons.signup")} 
                    onPress={() => navigation.navigate("register-stack")}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    logo: { maxWidth: "70%", height: "26%", marginTop: -100 },
    title: { marginVertical: 10, color: theme.colors.gray },
    buttonArea: { width: '100%', position: 'absolute', justifyContent: 'center', 
        marginBottom: 40, flexDirection: "row", bottom: 10 }
})

export default InitializeScreen;
