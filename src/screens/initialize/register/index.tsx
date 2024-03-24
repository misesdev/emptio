import { useEffect, useState } from "react";
import SplashScreen from "@components/general/SplashScreen";
import { Image, StyleSheet, Text, View } from "react-native";
import { ButtonPrimary } from "@components/form/Buttons";
import theme from "@src/theme";
import { TextBox } from "@components/form/TextBoxs";
import { insertUser } from "@/src/services/memory";

const Register = ({ navigation }: any) => {

    const [userName, setUserName] = useState("")

    const handlerLogin = () => {
        
    }

    return (
        <View style={theme.styles.container}>
            <Image style={styles.logo} source={require("@assets/emptio.png")} />

            <Text style={styles.title}>You just need to set your username, the app takes care of the rest!</Text>

            <TextBox placeholder="User Name" value={userName} onChangeText={setUserName} />

            <View style={styles.buttonArea}>
                <ButtonPrimary title="REGISTER" onPress={handlerLogin} />
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

export default Register