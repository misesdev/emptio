
import { StyleSheet, View, Text } from "react-native"
import theme from "@src/theme"

const ChangeLanguage = ({ navigation }: any) => {
    return (
        <View style={theme.styles.container} >
            <Text style={styles.title}>Change Language</Text>
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

export default ChangeLanguage