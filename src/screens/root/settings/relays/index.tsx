
import { StyleSheet, View, Text } from "react-native"
import theme from "@src/theme"

const ManageRelaysScreen = ({ navigation }: any) => {
    return (
        <View style={theme.styles.container} >
            <Text style={styles.title}>Manager Relays</Text>
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

export default ManageRelaysScreen