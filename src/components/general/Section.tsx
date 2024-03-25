import theme from "@src/theme"
import { Ionicons } from "@expo/vector-icons"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

export const Section = ({ children }: any) => {

    return (
        <View style={styles.section}>
            {children}
        </View>
    )
}

type LinkSectionProps = {
    label: string,
    onPress: () => void,
    icon?: IoniconsNames
}

export const LinkSection = ({ label, onPress, icon }: LinkSectionProps) => {
    return <TouchableOpacity style={styles.link} onPress={onPress}>
        { icon && <Ionicons style={styles.linkIcon} name={icon} /> }
        <Text style={styles.linkText}>{label}</Text>
    </TouchableOpacity>
}

const styles = StyleSheet.create({
    section: {
        width: "92%",
        marginVertical: 8,
        minHeight: 10,
        borderRadius: 18,
        padding: 5,
        backgroundColor: theme.colors.section, 
    },
    link: {
        width: '100%',
        padding: 12,
        margin: 5,
        borderRadius: 10,
        flexDirection: "row"
    },
    linkIcon: {
        margin: 5,
        fontSize: theme.icons.mine,
        color: theme.colors.gray,
        backgroundColor: theme.colors.section, 
    },
    linkText: {
        fontSize: 18,
        fontWeight: '400',
        paddingHorizontal: 5,
        color: theme.colors.gray
    }
})
