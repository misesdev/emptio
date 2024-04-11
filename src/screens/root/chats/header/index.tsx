import { StyleSheet, View } from "react-native"
import theme from "@/src/theme"

export const HeaderChats = ({ navigation }: any) => {
    return (
        <View style={styles.header}>
            
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        width: "100%",
        flexDirection: "row",
        paddingVertical: 5,
        backgroundColor: theme.colors.black
    },
})