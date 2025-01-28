import { Animated, Image, StyleSheet, Text, View } from "react-native"
import { useRef, useState } from "react"
import theme from "@src/theme"

var showMessageFunction: (message: string) => void

const AlertBox = () => {

    const fadeAnim = useRef(new Animated.Value(800)).current; // Initial value for opacity: 0

    const [message, setMessage] = useState<string>()

    showMessageFunction = (message: string) => {

        message = message.length < 75 ? message : `${message.substring(0, 75)}...`

        setMessage(message)

        // move the component message to top
        Animated.timing(fadeAnim, {
            toValue: new Animated.Value(580),
            useNativeDriver: true,
            duration: 300,
        }).start()

        // return the component text to down
        setTimeout(() => {
            Animated.timing(fadeAnim, {
                toValue: new Animated.Value(800),
                useNativeDriver: true,
                duration: 300,
            }).start()
        }, 3000)
    }

    return (
        <Animated.View style={[styles.container, { transform: [{ translateY: fadeAnim }] }]}>
            {/* <View style={styles.container}> */}
            <View style={styles.messageContainer}>
                <View style={{ width: "20%", justifyContent: "center", padding: 5 }}>
                    <Image source={require("assets/icon.png")} style={{ width: 40, height: 40, borderRadius: 20 }} />
                </View>
                <View style={{ width: "80%", justifyContent: "center", padding: 5 }}>
                    <Text style={styles.message}>{message} </Text>
                </View>
            </View>
            {/* </View> */}
        </Animated.View>
    )
}

export const alertMessage = (message: string) => {
    showMessageFunction(message)
}

const styles = StyleSheet.create({
    container: { width: "100%", position: "absolute", alignItems: "center" },
    messageContainer: { flexDirection: "row", width: "70%", padding: 5, borderRadius: 20, backgroundColor: theme.colors.blue },
    message: { fontWeight: "500", color: theme.colors.white }
})

export default AlertBox
