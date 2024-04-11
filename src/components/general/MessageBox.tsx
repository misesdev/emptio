import { useEffect, useState } from "react"
import { Modal, StyleSheet, Text, View } from "react-native"
import { ButtonDanger, ButtonDefault, ButtonSuccess } from "@components/form/Buttons"
import { useTranslate } from "@src/services/translate"
import theme from "@src/theme"

type typeMessage = "alert" | "error" | "success"

type MessageAction = {
    label: string,
    onPress: () => void
}

type alertBoxProps = {
    title?: string,
    message: string,
    infolog?: string,
    action?: MessageAction,
    type?: typeMessage
}

var showMessageFunction: (config: alertBoxProps) => void

const MessageBox = () => {

    const [title, setTitle] = useState<string>()
    const [type, setType] = useState<typeMessage>()
    const [message, setMessage] = useState<string>()
    const [infolog, setInfolog] = useState<string>()
    const [action, setAction] = useState<MessageAction>()
    const [baseColor, setBaseColor] = useState<string>(theme.colors.red)

    const [visible, setVisible] = useState(false)

    showMessageFunction = ({ title, message, infolog, type, action }: alertBoxProps) => {
        setType(type)
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

    useEffect(() => {
        switch (type) {
            case "alert":
                setBaseColor(theme.colors.white)
                break
            case "success":
                setBaseColor(theme.colors.white)
                break
        }
    }, [visible])

    return (
        <Modal animationType="slide" onRequestClose={handleClose} visible={visible} transparent >
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0, .6)" }}>
                <View style={styles.box}>

                    <Text style={{ color: baseColor, fontSize: 28, marginVertical: 10, fontWeight: 'bold' }}> {title ?? useTranslate("commons.oops")} </Text>

                    <Text style={styles.message}> {message} </Text>

                    {infolog && <Text style={styles.infolog}>{infolog}</Text>}

                    <View style={styles.sectionButtons}>
                        <ButtonDefault label={useTranslate("commons.close")} onPress={handleClose} />
                        {action && <ButtonSuccess label={action.label} onPress={handleAction} />}
                    </View>

                </View>
            </View>
        </Modal>
    )
}

export const showMessage = ({ title, message, infolog, type, action }: alertBoxProps) => {
    setTimeout(() => { showMessageFunction({ title, message, infolog, type, action }) }, 100)
}

const styles = StyleSheet.create({
    box: {
        width: "90%",
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',      
        backgroundColor: theme.colors.blue,
    },
    message: {
        fontSize: 16,
        marginHorizontal: 10,
        paddingVertical: 30,
        paddingBottom: 20,
        marginVertical: 10,
        color: theme.colors.white,
        textAlign: 'center'
    },
    infolog: {
        maxWidth: "80%",
        paddingHorizontal: 15, 
        paddingVertical: 8,
        marginVertical: 18,
        borderRadius: 10,
        backgroundColor: theme.colors.gray
    },
    sectionButtons: {
        bottom: 10,
        flexDirection: "row"
    },
    close: {
        top: 20,
        left: 20,
        position: "absolute"
    }
})

export default MessageBox