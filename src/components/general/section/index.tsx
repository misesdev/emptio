import theme from "@src/theme"
import { Ionicons } from "@expo/vector-icons"
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native"
import { IconNames } from "@src/services/types/icons"
import { useState } from "react"

type SectionProps = {
    style?: StyleProp<ViewStyle>
    children: any
}

export const SectionContainer = ({ style, children }: SectionProps) => {

    return (
        <View style={[styles.section, style]}>
            {children}
        </View>
    )
}

type LinkSectionProps = {
    label: string,
    onPress: () => void,
    icon?: IconNames
}

export const LinkSection = ({ label, onPress, icon }: LinkSectionProps) => {

    const [backColor, setBackColor] = useState(theme.colors.transparent)

    return (
        <TouchableOpacity activeOpacity={.6} onPress={onPress} 
            style={[styles.link, { backgroundColor: backColor }]}            
            onPressIn={() => setBackColor("rgba(255,255,255, .1)")}
            onPressOut={() => setBackColor(theme.colors.transparent)}
        >
            {icon && <Ionicons style={styles.linkIcon} name={icon} />}
            <Text style={styles.linkText}>{label}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    section: {
        width: "96%",
        marginVertical: 8,
        borderRadius: 18,
        padding: 5,
        backgroundColor: theme.colors.section,
    },
    link: {
        width: '100%',
        padding: 8,
        margin: 2,
        borderRadius: 10,
        flexDirection: "row",
    },
    linkIcon: {
        margin: 5,
        fontSize: theme.icons.mine,
        color: theme.colors.white,
        backgroundColor: theme.colors.transparent,
    },
    linkText: {
        fontSize: 18,
        fontWeight: '400',
        paddingHorizontal: 5,
        color: theme.colors.white
    }
})
