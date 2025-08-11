import { useState } from "react"
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useTranslateService } from "@/src/providers/TranslateProvider"
import theme from "@src/theme"

type typeMessage = "alert" | "error" | "success"

interface MessageAction {
    label: string,
    onPress: () => void
}

interface alertBoxProps {
    title?: string,
    message: string,
    infolog?: string,
    action?: MessageAction,
    type?: typeMessage
}

interface ButtonProps {
    label: string,
    onPress: () => void,
}

var showMessageFunction: (config: alertBoxProps) => void

const ButtonLight = ({ label, onPress }: ButtonProps) => {
    const [backColor, setBackColor] = useState(theme.colors.transparent)
    return (
        <TouchableOpacity onPress={onPress}
            onPressIn={() => setBackColor("rgba(255, 255, 255, .2)")}
            onPressOut={() => setBackColor(theme.colors.transparent)}
            style={{ padding: 10, paddingHorizontal: 15, borderRadius: theme.design.borderRadius, 
                backgroundColor: backColor }}
        >
            <Text style={{ fontSize: 14, fontWeight: "bold", color: theme.colors.white }}>{label}</Text>
        </TouchableOpacity>
    )
}

const MessageBox = () => {

    const [title, setTitle] = useState<string>()
    const [message, setMessage] = useState<string>()
    const [infolog, setInfolog] = useState<string>()
    const [action, setAction] = useState<MessageAction>()
    const { useTranslate } = useTranslateService()

    const [visible, setVisible] = useState(false)

    showMessageFunction = ({ title, message, infolog, action }: alertBoxProps) => {
        setTitle(title)
        setMessage(message)
        setInfolog(infolog)
        setAction(action)
        setVisible(true)
    }

    const handleClose = () => {
        setVisible(false)
    }

    const handleAction = () => {
        handleClose()
        action?.onPress()
    }

    return (
        <Modal animationType="fade" onRequestClose={handleClose} visible={visible} transparent >
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0, .6)" }}>
                <View style={styles.box}>

                    <Text style={{ color: theme.colors.white, fontSize: 20, marginVertical: 10, fontWeight: 'bold' }}>{title ?? useTranslate("commons.oops")}</Text>
                    
                    <View style={{ width: "100%", marginTop: 10, marginBottom: 20 }}>
                        <Text style={styles.message}>{message}</Text>
                    </View>

                    {infolog && <Text style={styles.infolog}>{infolog}</Text>}

                    <View style={styles.sectionButtons}>
                        {action && <ButtonLight label={action.label} onPress={handleAction} />}
                        <ButtonLight label={useTranslate("commons.close")} onPress={handleClose} />
                    </View>

                </View>
            </View>
        </Modal>
    )
}

export const showMessage = (props: alertBoxProps) => {
    showMessageFunction(props) 
}

const styles = StyleSheet.create({
    box: { padding: 10, paddingHorizontal: 15, width: "85%", borderRadius: theme.design.borderRadius, 
        backgroundColor: theme.colors.section },
    message: { fontSize: 14, color: theme.colors.gray },
    infolog: { paddingHorizontal: 15, paddingVertical: 8, marginVertical: 18, 
        borderRadius: theme.design.borderRadius, backgroundColor: theme.colors.semitransparent, 
        color: theme.colors.gray },
    sectionButtons: { width: "100%", flexDirection: "row-reverse" },
    close: { top: 20, left: 20, position: "absolute" },
    absolute: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    }
})

export default MessageBox
