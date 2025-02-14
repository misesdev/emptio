import { useState } from "react"
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useTranslateService } from "@src/providers/translateProvider"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { User } from "@services/memory/types"
import { NDKEvent } from "@nostr-dev-kit/ndk"
import { IconNames } from "@services/types/icons"
import { copyToClipboard } from "@src/utils"
import theme from "@src/theme"

type OptionProps = { 
    label: string, 
    icon: IconNames, 
    onPress: () => void 
}

type ShowFunctionProps = { event: NDKEvent, isUser: boolean }

var showMessageOptionsFunction: (props: ShowFunctionProps) => void

type Props = {
    user: User,
    deleteMessage: (user: User, event: NDKEvent, onlyForMe: boolean) => void
}

const MessageOptionsBox = ({ user, deleteMessage }: Props) => {

    const { useTranslate } = useTranslateService()
    const [eventMessage, setEventMessage] = useState<NDKEvent>()
    const [visible, setVisible] = useState(false)
    const [isUser, setIsUser] = useState(false)

    showMessageOptionsFunction = ({ event, isUser }) => {
        setEventMessage(event)
        setIsUser(isUser)
        setVisible(true)
    }

    const handleDeleteMessage = (onlyForMe: boolean) => {
        if(eventMessage)
            deleteMessage(user, eventMessage, onlyForMe)
        setVisible(false)
    }

    const handleCopy = async () => {
        copyToClipboard(eventMessage?.content ?? "")
        setVisible(false)
    }
    
    const OptionItem = ({ label, icon, onPress }: OptionProps) => {
        return (
            <TouchableOpacity onPress={onPress} style={styles.option} >
                <View style={{ width: "8%", height: "100%", alignItems: "center" }}>
                    <Ionicons style={{ paddingVertical: 10 }} name={icon} size={18} color={theme.colors.white} />
                </View>
                <View style={{ width: "92%", height: "100%", alignItems: "center" }}>
                    <Text style={styles.labelOption}>{label}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <Modal animationType="fade" transparent visible={visible}
            onRequestClose={() => setVisible(false)} 
        >
            <View style={styles.container}>
                <View style={styles.box}>
                   <OptionItem icon="copy-outline"
                        label={useTranslate("commons.copy-text")} onPress={() => handleCopy()}
                    />
                    { isUser &&
                       <OptionItem icon="trash-outline"
                            label={useTranslate("commons.delete-for-all")} 
                            onPress={() => handleDeleteMessage(false)} // onlyForMe=false
                        />
                    }
                   <OptionItem icon="trash-bin-outline"
                        label={useTranslate("commons.delete-for-me")} 
                        onPress={() => handleDeleteMessage(true)} // onlyForMe=true
                    />
                </View>
            </View> 
        </Modal>
    )
}

export const showOptiosMessage = (props: ShowFunctionProps) => {
    showMessageOptionsFunction(props)
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: "center", justifyContent: "center",
        backgroundColor: theme.colors.semitransparent },
    box: { padding: 10, width: "75%", borderRadius: 10, backgroundColor: theme.colors.section },
    option: { width: "100%", flexDirection: "row", padding: 5, borderRadius: 10,
        marginVertical: 2, backgroundColor: theme.colors.section },
    labelOption: { width: "100%", color: theme.colors.white, padding: 10, fontWeight: "400", 
        fontSize: 14 },
})

export default MessageOptionsBox
