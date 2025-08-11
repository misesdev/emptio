import theme from "@src/theme"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native"
import { IconNames } from "@services/types/icons"
import { useState } from "react"

interface SectionProps {
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

interface LinkSectionProps {
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
    section: { width: "90%", marginVertical: 8, borderRadius: theme.design.borderRadius, 
        padding: 5, backgroundColor: theme.colors.section },
    link: { width: '100%', padding: 8, marginVertical: 2, borderRadius: theme.design.borderRadius, 
        flexDirection: "row" },
    linkIcon: { margin: 5, fontSize: theme.icons.mine, color: theme.colors.white,
        backgroundColor: theme.colors.transparent },
    linkText: { fontSize: 14, fontWeight: '400', paddingHorizontal: 8, paddingVertical: 5,  
        color: theme.colors.white }
})
