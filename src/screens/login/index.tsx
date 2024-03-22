import theme from "@src/theme"
import { StyleSheet, Text, View } from "react-native"

export const InitialPage = () => {
    return (
        <View style={theme.styles.container}>
            <Text style={styles.title}>User Management</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.colors.gray
    }
})