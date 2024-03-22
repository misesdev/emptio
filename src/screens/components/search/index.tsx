import { StyleSheet, View, Text } from "react-native"
import theme from "@src/theme"

export const FeedSearch = ({ navigation }: any) => {
    return (
        <View style={theme.styles.container} >
            <Text style={styles.title}>Search Feed</Text>
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

