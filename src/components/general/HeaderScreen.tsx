import theme from "@src/theme"
import { View, Text, TouchableOpacity, StyleProp, ViewStyle, StyleSheet } from "react-native"
import Ionicons from '@react-native-vector-icons/ionicons'

type HeaderProps = {
    title: string,
    onClose: () => void,
    style?: StyleProp<ViewStyle>
}

export const HeaderScreen = ({ title, onClose, style }: HeaderProps) => {

    return (
        <View style={[styles.header, style]}>
            <View style={{ width: "75%", padding: 6 }}>
                <Text style={styles.title}>
                    {title}
                </Text>
            </View>
            <View style={{ width: "25%", padding: 6, flexDirection: "row-reverse" }}>
                <TouchableOpacity activeOpacity={.7} onPress={onClose} style={styles.button}>
                    <Ionicons name="close" size={theme.icons.medium} color={theme.colors.white} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: { flexDirection: "row", width: "100%", marginBottom: 15 },
    title: { color: theme.colors.white, fontSize: 20, fontWeight: "bold", marginLeft: 15 },
    button: { borderRadius: 20, padding: 6, backgroundColor: theme.colors.gray, marginRight: 15 }
})
