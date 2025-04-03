
import { StyleSheet, View, ScrollView, Text } from "react-native"
import { HeaderScreen } from "@components/general/HeaderScreen"
import MessageBox, { showMessage } from "@components/general/MessageBox"
import { ButtonPrimary } from "@components/form/Buttons"
import { pushMessage } from "@services/notification"
import { useTranslateService } from "@src/providers/translateProvider"
import useNDKStore from "@services/zustand/ndk"
import { useEffect, useState } from "react"
import { StackScreenProps } from "@react-navigation/stack"
import { storageService } from "@services/memory"
import { RelayList } from "./commons/relays"
import theme from "@src/theme"
import AddRelay from "./add"
import axios from "axios"
import { SectionHeader } from "@/src/components/general/section/headers"

const ManageRelaysScreen = ({ navigation }: StackScreenProps<any>) => {

    const { ndk } = useNDKStore()
    const { useTranslate } = useTranslateService()
    const [visible, setVisible] = useState(false)
    const [defaultRelays, setDefaultRelays] = useState<string[]>([])
    const [connectedRelays, setConnectedRelays] = useState<string[]>([])
    const [notConnectedRelays, setNotConnectedRelays] = useState<string[]>([])

    useEffect(() => { 
        setTimeout(loadDataRelays, 20)
    }, [])

    const loadDataRelays = async () => { 
        let all_relays = await storageService.relays.list()
        let connected_relays = ndk.pool.connectedRelays().map(r => r.url)
        let not_connected_relays = all_relays.filter(r => !connectedRelays.includes(r))

        setNotConnectedRelays(not_connected_relays)
        setConnectedRelays(connected_relays)
        setDefaultRelays(all_relays)
    }

    const handleAddRelay = () => setVisible(true)

    const handleSaveRelay = async (relay: string) => {
        try {
            const relayList = [...defaultRelays, relay]

            const httpClient = axios.create({ headers: { Accept: "application/nostr+json" } })

            const response = await httpClient.get(relay.replace("wss://", "https://"))

            if (response.status != 200)
                return await pushMessage(useTranslate("message.relay.invalid"))

            ndk.addExplicitRelay(relay, undefined, true)

            await storageService.relays.add(relay)

            setDefaultRelays(relayList)
        } 
        catch { 
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

                    await storageService.relays.delete(relay)
                    
                    setDefaultRelays(prev => prev.filter(item => item != relay))

                    ndk.explicitRelayUrls?.splice(ndk.explicitRelayUrls.indexOf(relay), 1)

                    pushMessage(useTranslate("message.relay.delete_success"))
                }
            }
        })
    }

    return (
        <View style={{ flex: 1 }}>
            <HeaderScreen 
                title={useTranslate("settings.relays")} 
                onClose={() => navigation.goBack()}
            />
            <ScrollView contentContainerStyle={theme.styles.scroll_container} >

                {!defaultRelays.length && 
                    <Text style={{ color: theme.colors.gray }}>
                        {useTranslate("message.relay.empty")}
                    </Text>
                }
                
                {connectedRelays.length &&
                    <View>
                        <SectionHeader label="Relays conectados" />
                        <RelayList relays={connectedRelays} onPressRelay={() => {}} />
                    </View>
                }
                {notConnectedRelays.length &&
                    <View>
                        <SectionHeader label="Relays conectados" />
                        <RelayList relays={notConnectedRelays} onPressRelay={() => {}} />
                    </View>
                }

                {/* <SectionHeader label="Todos os relays" /> */}
                {/* <RelayList relays={defaultRelays} onPressRelay={handleDeleteRelay} /> */}

                <View style={{ height: 100 }}></View>

            </ScrollView>
            <View style={styles.buttonarea}>
                <ButtonPrimary 
                    label={useTranslate("labels.relays.add")} 
                    onPress={handleAddRelay} 
                />
            </View>            
            <AddRelay 
                visible={visible}
                relays={defaultRelays} 
                onClose={() => setVisible(false)} 
                onSaveRelay={handleSaveRelay} 
            />
            <MessageBox />
        </View>
    )
}

const styles = StyleSheet.create({
    buttonarea: { width: "100%", position: "absolute", alignItems: "center", bottom: 30 }
})

export default ManageRelaysScreen
