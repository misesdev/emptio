import { TouchableOpacity, StyleSheet, ScrollView, View } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import theme from "@src/theme"

export type MessageActionType = "delete" | "copy" | "cancel" | "foward" 

interface OptionProps { 
    action: MessageActionType;
    handleClick: (type: MessageActionType) => void;
}
const OptionGroup = ({ action, handleClick }: OptionProps) => {
    return (
        <TouchableOpacity style={styles.section} onPress={() => handleClick(action)}>
            {action == "cancel" && <Ionicons name="arrow-undo" size={20} color={theme.colors.white}/>}
            {action == "copy" && <Ionicons name="copy" size={20} color={theme.colors.white}/>}
            {action == "delete" && <Ionicons name="trash" size={20} color={theme.colors.white}/>}
            {action == "foward" && <Ionicons name="arrow-redo" size={20} color={theme.colors.white}/>}
        </TouchableOpacity>
    )
}

type Props = {
    handleAction: (type: MessageActionType) => void
}

const MessageGroupAction = ({ handleAction }: Props) => {
    return (
        <View style={styles.container}>
            <OptionGroup action="cancel" handleClick={handleAction} />
            <OptionGroup action="copy" handleClick={handleAction} />
            <OptionGroup action="delete" handleClick={handleAction}/>
            <OptionGroup action="foward" handleClick={handleAction}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { position: "absolute", bottom: 100, zIndex: 99, width: "60%", marginHorizontal: "20%", 
        borderRadius: 10, alignItems: "center", backgroundColor: theme.colors.semitransparentdark, 
        flexDirection: "row-reverse", justifyContent: "center" },
    containerRow: { width: "100%", padding: 6, flexDirection: "row-reverse" },
    section: { padding: 8, margin: 10, marginHorizontal: 5, borderRadius: 10, 
        paddingHorizontal: 14, backgroundColor: theme.colors.section },
})

export default MessageGroupAction
