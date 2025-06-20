import theme from "@src/theme"
import { View, Text, TouchableOpacity, StyleProp, ViewStyle, StyleSheet } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'

interface HeaderProps {
    title: string,
    onClose: () => void,
    action?: React.JSX.Element,
    style?: StyleProp<ViewStyle>
}

export const HeaderScreen = ({ title, onClose, action, style }: HeaderProps) => {

    return (
        <View style={[styles.header, style]}>
            <View style={{ width: "75%", padding: 6 }}>
                <Text style={styles.title}>
                    {title}
                </Text>
            </View>
            <View style={{ width: "25%", padding: 6, flexDirection: "row-reverse" }}>
                <TouchableOpacity activeOpacity={.7} onPress={onClose} style={styles.button}>
                    <Ionicons name="close" size={30} color={theme.colors.white} />
                </TouchableOpacity>
                {action && action}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: { backgroundColor: theme.colors.black, flexDirection: "row", width: "100%", 
        zIndex: 999 },
    title: { color: theme.colors.white, fontSize: 20, fontWeight: "bold", marginLeft: 15 },
    button: { borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, marginRight: 10 }
})
