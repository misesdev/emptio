import { FormControl } from "@/src/components/form/FormControl"
import { useTranslate } from "@/src/services/translate"
import theme from "@/src/theme"
import React, { useState } from "react"
import { Modal, StyleSheet, View, Text, TouchableOpacity } from "react-native"

type ButtonProps = {
    label: string,
    onPress: () => void,
}

const ButtonLight = ({ label, onPress }: ButtonProps) => {
    const [backColor, setBackColor] = useState(theme.colors.transparent)
    return (
        <TouchableOpacity onPress={onPress}
            onPressIn={() => setBackColor("rgba(255, 255, 255, .2)")}
            onPressOut={() => setBackColor(theme.colors.transparent)}
            style={{ padding: 10, paddingHorizontal: 15, borderRadius: 8, backgroundColor: backColor }}
        >
            <Text style={{ fontSize: 14, fontWeight: "bold", color: theme.colors.white }}>{label}</Text>
        </TouchableOpacity>
    )
}

type Props = {
    visible: boolean,
    onClose: () => void,
    onSaveRelay: (relay: string) => void
}

const AddRelay = ({ visible, onClose, onSaveRelay }: Props) => {

    const [isValid, setIsValid] = useState(true)
    const [relayAddress, setRelayAddress] = useState("wss://")

    const onChangeTextRelay = async (relay_address: string) => {

        var relay = relay_address.toLowerCase()

        setRelayAddress(relay_address.toLowerCase())

        if (relay.includes("wss://")) {
            const validRelay = await verifyRelay(relay)
            setIsValid(validRelay)
        }
        else
            setIsValid(false)
    }

    const verifyRelay = async (relay: string): Promise<boolean> => {

        const regex = /^[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

        return regex.test(relay.replace("wss://", ""))
    }

    const handleAddRelay = () => {
        if (isValid) 
            onSaveRelay(relayAddress)
    }

    const handleClose = () => {
        setRelayAddress("wss://")
        onClose()
    }

    return (
        <Modal animationType="slide" onRequestClose={handleClose} visible={visible} transparent >
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0, .6)" }}>
                <View style={styles.box}>

                    <Text style={styles.title}>Adicionar Relay</Text>

                    <View style={{ width: "100%", marginTop: 10, marginBottom: 20 }}>
                        <FormControl label="Relay" value={relayAddress} onChangeText={onChangeTextRelay} fullScreen />
                        {!isValid && <Text style={styles.validation_message}>relay inválido!</Text>}
                    </View>

                    <View style={styles.section_buttons}>
                        <ButtonLight label={useTranslate("commons.add")} onPress={handleAddRelay} />
                        <ButtonLight label={useTranslate("commons.close")} onPress={handleClose} />
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    title: { color: theme.colors.white, fontSize: 18, marginVertical: 10, fontWeight: 'bold' },
    box: { padding: 10, paddingHorizontal: 15, width: "90%", borderRadius: 8, backgroundColor: theme.colors.section },
    validation_message: { color: theme.colors.red, fontWeight: "bold" },
    section_buttons: { width: "100%", flexDirection: "row-reverse" },
})

export default AddRelay