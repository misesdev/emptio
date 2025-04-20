import theme from "@src/theme";
import { Text, ActivityIndicator, StyleSheet, Image, Modal, View } from "react-native";

interface Props {
    message?: string
}

const SplashScreen = ({ message }: Props) => {
    return (
        <Modal visible backdropColor={theme.colors.black}>
            <View style={styles.container}>
                <Image style={styles.logo} source={require("@assets/emptio.png")} />

                <ActivityIndicator style={styles.load} size={50} color={theme.colors.gray}></ActivityIndicator>

                {message && <Text style={styles.message}>{message}</Text>}
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.black, justifyContent: 'center',
        alignItems: 'center' },
    logo: { maxWidth: "80%", height: "25%" },
    load: { marginVertical: 80 },
    message: { color: theme.colors.gray, backgroundColor: "rgba(255, 255, 255, .1)",
        maxWidth: "80%", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10,
        position: "absolute", bottom: 100 }
});

export default SplashScreen
