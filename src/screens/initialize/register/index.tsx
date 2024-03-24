import { useState } from "react";
import SplashScreen from "@components/general/SplashScreen";
import { Image, StyleSheet, Text, View } from "react-native";
import { ButtonPrimary } from "@components/form/Buttons";
import theme from "@src/theme";
import { TextBox } from "@components/form/TextBoxs";
import MessageBox, { showMessage } from "@components/general/MessageBox";
import { SignUp } from "@src/services/userManager";

const Register = ({ navigation }: any) => {

    const [userName, setUserName] = useState("")
    const [loading, setLoading] = useState(false)

    const handlerRegister = () => {

        setLoading(true)
 
        SignUp({ userName, callback: () => navigation.navigate("core-stack") })        
    }

    if(loading)
        return <SplashScreen message="registering.."/>

    return (
        <>
            <View style={theme.styles.container}>
                <Image style={styles.logo} source={require("@assets/emptio.png")} />

                <Text style={styles.title}>You just need to set your username, the app takes care of the rest!</Text>

                <TextBox placeholder="User Name" value={userName} onChangeText={setUserName} />

                <View style={styles.buttonArea}>
                    <ButtonPrimary title="Sign Up" onPress={handlerRegister} />
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

export default Register

