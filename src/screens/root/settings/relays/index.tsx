
import { StyleSheet, View, ScrollView, Text } from "react-native"
import { HeaderScreen } from "@components/general/HeaderScreen"
import MessageBox, { showMessage } from "@components/general/MessageBox"
import { ButtonPrimary } from "@components/form/Buttons"
import { RelayList } from "@components/nostr/relays/RelayList"
import { deleteRelay, getRelays, insertRelay } from "@services/memory/relays"
import { pushMessage } from "@services/notification"
import { useTranslateService } from "@src/providers/translateProvider"
import useNDKStore from "@/src/services/zustand/ndk"
import { useCallback, useEffect, useState } from "react"
import theme from "@src/theme"
import AddRelay from "./add"
import axios from "axios"
import { StackScreenProps } from "@react-navigation/stack"

const ManageRelaysScreen = ({ navigation }: StackScreenProps<any>) => {

    const { ndk } = useNDKStore()
    const { useTranslate } = useTranslateService()
    const [visible, setVisible] = useState(false)
    const [relays, setRelays] = useState<string[]>([])

    useEffect(() => { 
        setTimeout(async () => { 
            await loadDataRelays() 
        }, 20)
    }, [])

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
                return await pushMessage(useTranslate("message.relay.invalid"))

            ndk.addExplicitRelay(relay, undefined, true)

            await insertRelay(relay)

            setRelays(relayList)
        } 
        catch(ex) { 
            return await pushMessage(useTranslate("message.default_error")) 
        }

        await pushMessage(useTranslate("message.relay.save_success"))
    }

    const handleDeleteRelay = (relay: string) => {
        showMessage({
            title: useTranslate("message.relay.title_delete"),
            message: useTranslate("message.relay.confirm_delete"),
            action: {
                label: useTranslate("commons.delete"),
                onPress: async () => {       

                    await deleteRelay(relay)
                    
                    setRelays(prevItems => prevItems.filter(item => item != relay))

                    ndk.explicitRelayUrls?.splice(ndk.explicitRelayUrls.indexOf(relay), 1)

                    pushMessage(useTranslate("message.relay.delete_success"))
                }
            }
        })
    }

    const goBack = useCallback(() => navigation.goBack(), [])

    return (
        <View style={{ flex: 1 }}>
            <HeaderScreen title={useTranslate("settings.relays")} onClose={goBack} />
            <ScrollView contentContainerStyle={theme.styles.scroll_container} >

                {!relays.length && 
                    <Text style={{ color: theme.colors.gray }}>
                        {useTranslate("message.relay.empty")}
                    </Text>
                }

                <RelayList relays={relays} onDelete={handleDeleteRelay} />

                <View style={{ height: 80 }}></View>

            </ScrollView>
            <View style={styles.buttonarea}>
                <ButtonPrimary label={useTranslate("labels.relays.add")} onPress={handleAddRelay} />
            </View>            
            <AddRelay visible={visible} relays={relays} onClose={() => setVisible(false)} onSaveRelay={handleSaveRelay} />
            <MessageBox />
        </View>
    )
}

const styles = StyleSheet.create({
    buttonarea: { width: "100%", position: "absolute", alignItems: "center", bottom: 40 }
})

export default ManageRelaysScreen
