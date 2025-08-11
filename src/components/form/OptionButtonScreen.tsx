import { View, TouchableOpacity, Text, StyleSheet } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import { IconNames } from "@services/types/icons";
import theme from "@src/theme"

export type OptionButtonProps = {
    label: string;
    description: string;
    onPress: () => void|Promise<void>;
    icon: IconNames;
}

const OptionButtonScreen = ({ icon, label, description, onPress }: OptionButtonProps) => (
    <View style={styles.row}>
        <TouchableOpacity 
            activeOpacity={.7}
            style={styles.selection}
            onPress={onPress}
        >
            <View style={{ width: "15%", height: "100%", alignItems: "center", justifyContent: "center" }}>
                <Ionicons name={icon} size={theme.icons.large} color={theme.colors.white} />
            </View>
            <View style={{ width: "85%" }}>
                <Text style={[styles.typeTitle, { color: theme.colors.white }]}>
                    {label}
                </Text>
                {description &&
                    <Text style={styles.typeDescription}>
                        {description} 
                    </Text>
                }
            </View>
        </TouchableOpacity>
    </View>
)

const styles = StyleSheet.create({
    row: { width: "100%", padding: 10, marginVertical: 5 },
    selection: { minHeight: 20, maxHeight: 100, borderRadius: theme.design.borderRadius, 
        flexDirection: "row", borderWidth: 1, backgroundColor: theme.colors.blueOpacity },
    typeTitle: { marginLeft: 6, fontSize: 16, fontWeight: "bold", marginTop: 15, 
        color: theme.colors.white },
    typeDescription: { marginBottom: 15, padding: 6, color: theme.colors.gray },
})

export default OptionButtonScreen
