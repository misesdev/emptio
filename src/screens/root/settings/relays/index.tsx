
import { StyleSheet, View, ScrollView } from "react-native"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { useTranslate } from "@/src/services/translate"
import MessageBox, { showMessage } from "@components/general/MessageBox"
import { ButtonPrimary } from "@components/form/Buttons"
import { RelayList } from "@components/nostr/relays/RelayList"
import { deleteRelay } from "@/src/services/memory/relays"
import { useEffect, useState } from "react"
import theme from "@src/theme"
import AddRelay from "./add"
import * as Notifications from "expo-notifications"

const ManageRelaysScreen = ({ navigation }: any) => {

    const [visible, setVisible] = useState(false)
    const [relays, setRelays] = useState<string[]>([])
    const [permissoes, setPermissoes] = useState(false)

    useEffect(() => {
        setRelays(Nostr.explicitRelayUrls)
        verificarPermissoes()
    }, [])

    const verificarPermissoes = async () => {
        const { status } = await Notifications.getPermissionsAsync()
        if(status != 'granted') {
            const result = await Notifications.requestPermissionsAsync()
            setPermissoes(result.status === 'granted')
        }
        else
            setPermissoes(true)

        console.log(permissoes)
    };

    const handleAddRelay = () => setVisible(true)

    const handleSaveRelay = async (relay: string) => {
        setVisible(false)
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "adicionado relay",
                body: "relay adicionado com sucesso!"
            },
            trigger: null,            
        })
    }

    const notificar = async () => {
        const result = await Notifications.scheduleNotificationAsync({
            content: {
                title: "adicionado relay",
                body: "relay adicionado com sucesso!"
            },
            trigger: null
        })
    }

    const handleDeleteRelay = (relay: string) => {
        showMessage({
            title: "Excluir Relay?",
            message: "O Relay será permanentemente excluído, deseja continuar?",
            action: {
                label: useTranslate("commons.delete"),
                onPress: async () => {
                    relays.splice(relays.indexOf(relay), 1)
                    await deleteRelay(relay)
                    setRelays(relays)
                }
            }
        })
    }

    return (
        <>
            <HeaderScreen title={useTranslate("settings.relays")} onClose={() => navigation.navigate("user-menu-stack")} />
            <ScrollView contentContainerStyle={theme.styles.scroll_container} >

                <RelayList relays={relays} onDelete={handleDeleteRelay} />

                <View style={{ height: 80 }}></View>

            </ScrollView>
            <View style={styles.buttonarea}>
                <ButtonPrimary label="Add Relay" onPress={notificar} />
            </View>
            <MessageBox />
            <AddRelay visible={visible} onClose={() => setVisible(false)} onSaveRelay={handleSaveRelay} />
        </>
    )
}

const styles = StyleSheet.create({
    buttonarea: { width: "100%", position: "absolute", alignItems: "center", bottom: 10 }
})

export default ManageRelaysScreen