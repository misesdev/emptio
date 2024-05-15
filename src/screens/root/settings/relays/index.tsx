
import { StyleSheet, View, ScrollView, ActivityIndicator } from "react-native"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { useTranslate } from "@/src/services/translate"
import MessageBox, { showMessage } from "@components/general/MessageBox"
import { ButtonPrimary } from "@components/form/Buttons"
import { RelayList } from "@components/nostr/relays/RelayList"
import { deleteRelay, getRelays, insertRelay } from "@/src/services/memory/relays"
import { pushMessage } from "@src/services/notification"
import { useEffect, useState } from "react"
import theme from "@src/theme"
import AddRelay from "./add"
import axios from "axios"

const ManageRelaysScreen = ({ navigation }: any) => {

    const [visible, setVisible] = useState(false)
    const [relays, setRelays] = useState<string[]>([])

    useEffect(() => { loadDataRelays() }, [])

    const loadDataRelays = async () => { 

        const relayList = await getRelays()

        setRelays(relayList)
    }

    const handleAddRelay = () => setVisible(true)

    const handleSaveRelay = async (relay: string) => {
        try {
            const relayList = [...relays, relay]

            const httpClient = axios.create({ headers: { Accept: "application/nostr+json" } })

            const response = await httpClient.get(relay.replace("wss://", "https://"))

            if (response.status != 200)
                return await pushMessage("relay inválido")

            Nostr.addExplicitRelay(relay, undefined, true)

            await insertRelay(relay)

            setRelays(relayList)
        } 
        catch(ex) { 
            return await pushMessage("Ocorreu um erro inesperado dutante o processamento.") 
        }

        await pushMessage("relay adicionado com sucesso!")
    }

    const handleDeleteRelay = (relay: string) => {
        showMessage({
            title: "Excluir Relay?",
            message: "O Relay será permanentemente excluído, deseja continuar?",
            action: {
                label: useTranslate("commons.delete"),
                onPress: async () => {       

                    await deleteRelay(relay)
                    
                    setRelays(prevItems => prevItems.filter(item => item != relay))

                    Nostr.explicitRelayUrls?.splice(Nostr.explicitRelayUrls.indexOf(relay), 1)

                    pushMessage("Relay removido com sucesso!")
                }
            }
        })
    }

    return (
        <>
            <HeaderScreen title={useTranslate("settings.relays")} onClose={() => navigation.navigate("user-menu-stack")} />
            <ScrollView contentContainerStyle={theme.styles.scroll_container} >

                {relays.length <= 0 && <ActivityIndicator color={theme.colors.gray} size={theme.icons.extra} />}

                <RelayList relays={relays} onDelete={handleDeleteRelay} />

                <View style={{ height: 80 }}></View>

            </ScrollView>
            <View style={styles.buttonarea}>
                <ButtonPrimary label="Add Relay" onPress={handleAddRelay} />
            </View>            
            <AddRelay visible={visible} relays={relays} onClose={() => setVisible(false)} onSaveRelay={handleSaveRelay} />
            <MessageBox />
        </>
    )
}

const styles = StyleSheet.create({
    buttonarea: { width: "100%", position: "absolute", alignItems: "center", bottom: 10 }
})

export default ManageRelaysScreen