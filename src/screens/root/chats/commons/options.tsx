import { TouchableOpacity, StyleSheet, View } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import theme from "@src/theme"

export type ChatActionType = "delete" | "markread" | "cancel" 

interface OptionProps { 
    action: ChatActionType, 
    handleAction: (type: ChatActionType) => void 
}
const OptionGroup = ({ action, handleAction }: OptionProps) => {
    return (
        <TouchableOpacity style={styles.section} onPress={() => handleAction(action)}>
            {action == "cancel" && <Ionicons name="close" size={20} color={theme.colors.white}/>}
            {action == "markread" && <Ionicons name="mail-open" size={20} color={theme.colors.white}/>}
            {action == "delete" && <Ionicons name="trash" size={20} color={theme.colors.white}/>}
        </TouchableOpacity>
    )
}


interface Props { onAction: (type: ChatActionType) => void }

const ChatGroupAction = ({ onAction }: Props) => {
  
    return (
        <View style={styles.container}>
            <OptionGroup action="cancel" handleAction={onAction} />
            <OptionGroup action="markread" handleAction={onAction} />
            <OptionGroup action="delete" handleAction={onAction} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { width: "100%", paddingHorizontal: 14, flexDirection: "row-reverse", 
        maxHeight: 42, backgroundColor: theme.colors.semitransparent },
    section: { paddingHorizontal: 12, padding: 6, margin: 5, borderRadius: 10, 
        backgroundColor: theme.colors.transparent },
})

export default ChatGroupAction
