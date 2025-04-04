
import { StyleSheet, View, ScrollView, Text } from "react-native"
import { HeaderScreen } from "@components/general/HeaderScreen"
import MessageBox, { showMessage } from "@components/general/MessageBox"
import { ButtonPrimary } from "@components/form/Buttons"
import { pushMessage } from "@services/notification"
import { useTranslateService } from "@src/providers/translateProvider"
import useNDKStore from "@services/zustand/ndk"
import { useEffect, useState } from "react"
import { StackScreenProps } from "@react-navigation/stack"
import { SectionHeader } from "@components/general/section/headers"
import { storageService } from "@services/memory"
import { RelayList } from "./commons/list"
import theme from "@src/theme"
import AddRelay from "./add"
import axios from "axios"
import { NDKRelay } from "@nostr-dev-kit/ndk-mobile"

const ManageRelaysScreen = ({ navigation }: StackScreenProps<any>) => {

    const { ndk } = useNDKStore()
    const { useTranslate } = useTranslateService()
    const [visible, setVisible] = useState(false)
    const [connectedRelays, setConnectedRelays] = useState<NDKRelay[]>([])
    const [notConnectedRelays, setNotConnectedRelays] = useState<NDKRelay[]>([])
    const [defaultRelays, setDefaultRelays] = useState<NDKRelay[]>([])

    useEffect(() => { 
        setTimeout(loadDataRelays, 20)
    }, [])

    const loadDataRelays = async () => {
        let ndk_relays: NDKRelay[] = Array.from(ndk.pool.relays.values())
        let connected_relays = ndk_relays.filter(r => r.connected) 
        let disconnected_relays = ndk_relays.filter(r => !r.connected)
        setNotConnectedRelays(disconnected_relays)
        setConnectedRelays(connected_relays)
        setDefaultRelays(ndk_relays)
    }

    const handleAddRelay = () => setVisible(true)

    const handleSaveRelay = async (relay: string) => {
        try {
            const httpClient = axios.create({ headers: { Accept: "application/nostr+json" } })

            const response = await httpClient.get(relay.replace("wss://", "https://"))

            if (response.status != 200)
                return await pushMessage(useTranslate("message.relay.invalid"))

            ndk.addExplicitRelay(relay, undefined, true)

            await storageService.relays.add(relay)
        } 
        catch { 
            return await pushMessage(useTranslate("message.default_error")) 
        }

        await pushMessage(useTranslate("message.relay.save_success"))
    }

    const openRelay = (relay: NDKRelay) => {
        navigation.navigate("manage-relay-stack", { relay })
    }

    return (
        <View style={{ flex: 1 }}>
            <HeaderScreen 
                title={useTranslate("settings.relays")} 
                onClose={() => navigation.goBack()}
            />
            <ScrollView 
                contentContainerStyle={theme.styles.scroll_container} 
            >

                {!ndk.pool.relays.size && 
                    <Text style={{ color: theme.colors.gray }}>
                        {useTranslate("message.relay.empty")}
                    </Text>
                }
                
                {connectedRelays.length &&
                    <View>
                        <SectionHeader label="Relays conectados" />
                        <RelayList relays={connectedRelays} onPressRelay={openRelay} />
                    </View>
                }
                {notConnectedRelays.length &&
                    <View>
                        <SectionHeader label="Relays nao conectados" />
                        <RelayList relays={notConnectedRelays} onPressRelay={openRelay} />
                    </View>
                }

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
