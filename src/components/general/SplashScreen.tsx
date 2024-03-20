import theme from "../../theme";
import { View, Text, ActivityIndicator, StyleSheet, Image } from "react-native";

type Props = {
    message?: string
}

const SplashScreen = ({ message }: Props) => {
    return (
        <View style={styles.container}>

            <Image style={styles.logo} source={require("../../../assets/logo.png")} />

            <ActivityIndicator style={styles.load} size={50} color={"white"}></ActivityIndicator>

            {message && <Text style={styles.message}>{message}</Text>}

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.COLORS.BLACK,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        maxWidth: "80%",
        height: "25%",
        marginTop: -100
    },
    load: {
        margin: 30
    },
    message: {
        color: theme.COLORS.WHITE,
        backgroundColor: "rgba(255, 255, 255, .1)",
        maxWidth: "80%",
        padding: 10,
        borderRadius: 10,
        position: "absolute",
        bottom: 100
    }
});

export default SplashScreen