import theme from "@src/theme"
import { StyleSheet, View } from "react-native"

export const Section = ({ children }: any) => {

    return (
        <View style={styles.section}>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    section: {
        width: "92%",
        marginVertical: 8,
        minHeight: 10,
        borderRadius: 18,
        backgroundColor: theme.colors.section, 
    }
})
