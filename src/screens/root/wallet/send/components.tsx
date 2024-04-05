import theme from "@src/theme"
import { View, Text, TouchableOpacity, StyleProp, ViewStyle } from "react-native"
import { Ionicons } from "@expo/vector-icons"

type HeaderProps = {
    title: string,
    onClose: () => void,
    style?: StyleProp<ViewStyle>
}

export const HeaderPageSend = ({ title, onClose, style }: HeaderProps) => {

    return (
        <View style={[{ flexDirection: "row", width: "100%" }, style]}>
            <View style={{ width: "75%", padding: 6 }}>
                <Text style={{ color: theme.colors.white, fontSize: 20, fontWeight: "bold", margin: 15 }}>
                    {title}
                </Text>
            </View>
            <View style={{ width: "25%", padding: 6, flexDirection: "row-reverse" }}>
                <TouchableOpacity activeOpacity={.7} onPress={onClose}
                    style={{ borderRadius: 20, padding: 6, backgroundColor: theme.colors.gray, margin: 15 }}
                >
                    <Ionicons name="close" size={theme.icons.medium} color={theme.colors.white} />
                </TouchableOpacity>
            </View>
        </View>
    )
}
