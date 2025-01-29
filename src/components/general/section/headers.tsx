import { IconNames } from "@src/services/types/icons"
import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'
import theme from "@src/theme"

export type ActionHeader = {
    label?: string,
    icon?: IconNames
    action: () => void
}

type Props = {
    label: string,
    icon?: IconNames,
    actions?: ActionHeader[]
}

export const SectionHeader = ({ label, icon, actions }: Props) => {

    return (
        <View style={styles.container}>
            <View style={{ width: actions ? "50%" : "100%", flexDirection: "row" }}>
                {icon && <Ionicons name={icon} size={theme.icons.medium} style={styles.labelIcon} />}
                <Text style={styles.label}>{label}</Text>
            </View>

            {
                actions &&
                <View style={{ width: "50%", flexDirection: "row-reverse", alignItems: "flex-end" }}>
                    {
                        actions.map((action, key) => {
                            return (
                                <TouchableOpacity style={styles.action} key={key} onPress={action.action} >
                                    {action.label && <Text style={styles.actionLabel}>{action.label}</Text>}
                                    {action.icon && <Ionicons style={styles.actionIcon} name={action.icon} />}
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        marginTop: 38,
        paddingHorizontal: 20,
        marginVertical: 10,
    },
    label: {
        fontSize: 20,
        fontWeight: "bold",
        color: theme.colors.gray,
        paddingVertical: 5
    },
    action: {
        padding: 8,
        borderRadius: 10,
        flexDirection: "row",
        marginHorizontal: 5,
        backgroundColor: theme.colors.blue
    },
    actionLabel: {
        fontSize: 16,
        marginHorizontal: 5,
        color: theme.colors.white
    },
    actionIcon: {
        fontSize: 20,
        color: theme.colors.white
    },
    labelIcon: {
        color: theme.colors.gray, 
        marginHorizontal: 10, 
        marginVertical: 7
    }
})
