
import { useState } from "react"
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Language } from "@/src/services/translate/types"
import { useTranslateService } from "@src/providers/translateProvider"
import theme from "@src/theme"
import { BlurView } from "expo-blur"
import { Ionicons } from "@expo/vector-icons"
import { User } from "@/src/services/memory/types"
import { NDKEvent } from "@nostr-dev-kit/ndk"
import { IconNames } from "@/src/services/types/icons"
import { setStringAsync } from "expo-clipboard"
import { pushMessage } from "@/src/services/notification"

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
        setVisible(true)
        setIsUser(isUser)
    }

    const handleDeleteMessage = (onlyForMe: boolean) => {
        if(eventMessage)
            deleteMessage(user, eventMessage, onlyForMe)
        setVisible(false)
    }

    const handleCopy = async () => {
        await setStringAsync(eventMessage?.content ?? "")

        pushMessage(useTranslate("message.copied"))
        setVisible(false)
    }
    
    const OptionItem = ({ label, icon, onPress }: OptionProps) => {
        return (
            <TouchableOpacity onPress={onPress} style={[styles.option]} >
                <View style={{ width: "8%", height: "100%", alignItems: "center" }}>
                    <Ionicons style={{ paddingVertical: 12 }} name={icon} size={18} color={theme.colors.white} />
                </View>
                <View style={{ width: "92%", height: "100%", alignItems: "center" }}>
                    <Text style={styles.labelOption}>{label}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <Modal animationType="fade" onRequestClose={() => setVisible(false)} visible={visible} transparent >
            <BlurView 
                tint="dark" 
                intensity={60} 
                style={styles.absolute}                
            >
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0, .6)" }}>
                    <View style={styles.box}>
                       <OptionItem icon="copy-outline"
                            label="Copiar texto" 
                            onPress={() => handleCopy()}
                        />
                        { isUser &&
                           <OptionItem icon="trash-outline"
                                label="Excluir para Todos" 
                                onPress={() => handleDeleteMessage(false)}
                            />
                        }
                       <OptionItem icon="trash-bin-outline"
                            label="Excluir para min" 
                            onPress={() => handleDeleteMessage(true)}
                        />
                    </View>
                </View>
            </BlurView> 
        </Modal>
    )
}

export const showOptiosMessage = (props: ShowFunctionProps) => {
    setTimeout(() => { showMessageOptionsFunction(props) }, 10)
}

const styles = StyleSheet.create({
    box: { padding: 10, width: "85%", borderRadius: 8, backgroundColor: theme.colors.section },
    option: { width: "100%", flexDirection: "row", padding: 5, borderRadius: 10, marginVertical: 2, backgroundColor: theme.colors.section },
    labelOption: { width: "100%", color: theme.colors.white, padding: 12, fontWeight: "400", fontSize: 14 },
    absolute: { position: "absolute", width: "100%", height: "100%", top: 0, left: 0, bottom: 0, right: 0 }
})

export default MessageOptionsBox
