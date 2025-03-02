import { Modal, StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from "react-native"
import { FormControl } from "@components/form/FormControl"
import { pushMessage } from "@services/notification"
import { useTranslateService } from "@src/providers/translateProvider"
import React, { useState } from "react"
import theme from "@src/theme"

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
    relays: string[],
    onClose: () => void,
    onSaveRelay: (relay: string) => Promise<void>
}

const AddRelay = ({ visible, relays, onClose, onSaveRelay }: Props) => {

    const { useTranslate } = useTranslateService()
    const [loading, setLoading] = useState(false)
    const [relayAddress, setRelayAddress] = useState("wss://")

    const onChangeTextRelay = async (relay_address: string) => setRelayAddress(relay_address.toLowerCase())

    const verifyRelay = async (relay: string): Promise<boolean> => {

        const regex = /^[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

        return regex.test(relay.replace("wss://", ""))
    }

    const handleAddRelay = async () => {

        if (relays.includes(relayAddress))
            return pushMessage(useTranslate("message.relay.already_exists"))

        if (await verifyRelay(relayAddress)) {
            setLoading(true)
            await onSaveRelay(relayAddress)
            setLoading(false)
            handleClose()
        } else
            await pushMessage(useTranslate("message.relay.invalid_format"))
    }

    const handleClose = () => {
        setRelayAddress("wss://")
        onClose()
    }

    return (
        <Modal animationType="slide" onRequestClose={handleClose} visible={visible} transparent >
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0, .6)" }}>
                <View style={styles.box}>
                    <View style={{ padding: 10, paddingHorizontal: 15 }}>
                        <Text style={styles.title}>{useTranslate("labels.relays.add")}</Text>

                        <View style={{ width: "100%", marginTop: 10, marginBottom: 20 }}>
                            <FormControl label="Relay" value={relayAddress} onChangeText={onChangeTextRelay} fullScreen />
                        </View>

                        <View style={styles.section_buttons}>
                            <ButtonLight label={useTranslate("commons.add")} onPress={handleAddRelay} />
                            <ButtonLight label={useTranslate("commons.close")} onPress={handleClose} />
                        </View>
                    </View>
                    {loading &&
                        <View style={styles.load_box}>
                            <ActivityIndicator color={theme.colors.gray} size={theme.icons.extra} />
                        </View>
                    }
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    title: { color: theme.colors.white, fontSize: 18, marginVertical: 10, fontWeight: 'bold' },
    box: { width: "90%", borderRadius: 8, backgroundColor: theme.colors.section },
    validation_message: { color: theme.colors.red, fontWeight: "bold" },
    section_buttons: { width: "100%", flexDirection: "row-reverse" },
    load_box: {
        position: "absolute",
        width: "100%",
        height: "100%",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, .1)"
    },
    absolute: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    }
})

export default AddRelay
