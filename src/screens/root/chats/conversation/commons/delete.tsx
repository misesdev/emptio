import { useCallback, useState } from "react"
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useTranslateService } from "@src/providers/translateProvider"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { IconNames } from "@services/types/icons"
import theme from "@src/theme"

interface OptionProps { 
    label: string, 
    icon: IconNames, 
    onPress: () => void 
}

const OptionItem = ({ label, icon, onPress }: OptionProps) =>  (
    <TouchableOpacity onPress={onPress} style={styles.option} >
        <View style={{ width: "8%", height: "100%", alignItems: "center" }}>
            <Ionicons style={{ paddingVertical: 10 }} name={icon} size={18} color={theme.colors.white} />
        </View>
        <View style={{ width: "92%", height: "100%", alignItems: "center" }}>
            <Text style={styles.labelOption}>{label}</Text>
        </View>
    </TouchableOpacity>
)

var showDeleteOptionsFunction: () => void

interface DeleteProps {
    deleteMessages: (onlyForMe: boolean) => void
}

const DeleteOptionsBox = ({ deleteMessages }: DeleteProps) => {

    const [visible, setVisible] = useState(false)
    const { useTranslate } = useTranslateService()

    showDeleteOptionsFunction = () => setVisible(true)

    const handleDeleteMessage = useCallback((onlyForMe: boolean) => {
        deleteMessages(onlyForMe)
        setVisible(false)
    }, [])

    return (
        <Modal animationType="none" visible={visible} transparent
            onRequestClose={() => setVisible(false)} 
        >
            <TouchableOpacity style={styles.container}
                onPress={() => setVisible(false)} activeOpacity={.9}
            >
                <View style={styles.box}>
                   <OptionItem icon="trash-outline"
                        label={useTranslate("commons.delete-for-all")} 
                        onPress={() => handleDeleteMessage(false)} // onlyForMe=false
                    />
                   <OptionItem icon="trash-bin-outline"
                        label={useTranslate("commons.delete-for-me")} 
                        onPress={() => handleDeleteMessage(true)} // onlyForMe=true
                    />
                </View>
            </TouchableOpacity> 
        </Modal>
    )
}

export const showDeleteOptions = () => showDeleteOptionsFunction()

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: "center", justifyContent: "center",
        backgroundColor: theme.colors.semitransparent },
    box: { padding: 10, width: "75%", borderRadius: 10, backgroundColor: theme.colors.section },
    option: { width: "100%", flexDirection: "row", padding: 5, borderRadius: 10,
        marginVertical: 2, backgroundColor: theme.colors.section },
    labelOption: { width: "100%", color: theme.colors.white, padding: 10, fontWeight: "400", 
        fontSize: 14 },
})

export default DeleteOptionsBox
