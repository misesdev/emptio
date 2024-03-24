import theme from "@/src/theme"
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
        margin: 8,
        minHeight: 200,
        borderRadius: 20,
        backgroundColor: theme.colors.section, 
    }
})
