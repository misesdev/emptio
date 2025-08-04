import { HeaderScreen } from "@components/general/HeaderScreen"
import { RelayList } from "@components/nostr/relays/RelayList"
import { SearchBox } from "@components/form/SearchBox"
import useNDKStore from "@services/zustand/useNDKStore"
import { useTranslateService } from "@src/providers/TranslateProvider"
import MessageBox, { showMessage } from "@components/general/MessageBox"
import TransparentLoader from "@components/general/TransparentLoader"
import { NostrRelay } from "@services/relays/types/NostrRelay"
import { useService } from "@src/providers/ServiceProvider"
import { pushMessage } from "@services/notification"
import { useEffect, useState } from "react"
import { View } from "react-native"
import axios from "axios"

const AddRelayScreen = ({ navigation }: any) => {

    const { ndk } = useNDKStore()
    const { relayService } = useService()
    const { useTranslate } = useTranslateService()
    const [relays, setRelays] = useState<NostrRelay[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [fetching, setFetching] = useState<boolean>(false)

    useEffect(() => {  handleSearch("") }, [])

    const handleSearch = async (searchTerm: string) => {

        setLoading(true)

        if(!searchTerm.trim().length) searchTerm = "nostr"

        const allRelays: NostrRelay[] = await relayService.list()
        
        const result: NostrRelay[] = await relayService.search(searchTerm.trim()) 
        
        setRelays(result.filter(r => !allRelays.find(relay => relay.url == r.url)))
        
        setLoading(false)
    }

    const handleOpenRelay = async (relay: NostrRelay) => {
        try {
            setFetching(true)

            const httpClient = axios.create({ headers: { Accept: "application/nostr+json" } })

            const response = await httpClient.get(relay.url.replace("wss", "https"))

            if (response.status != 200)
                throw new Error(useTranslate("message.relay.invalid"))
        
            // await relayService.update({
            //     ...relay
            // })

            setFetching(false)

            showMessage({
                title: useTranslate("labels.relays.add"),
                message: useTranslate("message.relay.adddetails"),
                infolog: relay.url,
                action: {
                    label: useTranslate("commons.add"),
                    onPress: async () => addRelay(relay.url)
                }
            })
        }
        catch (ex: any) {
            pushMessage(ex?.message)
            setFetching(false)
        }
    }

    const addRelay = async (relay: string) => {

        const ndkRelay = ndk.addExplicitRelay(relay)

        await relayService.add(relay)

        await ndkRelay.connect()

        pushMessage(useTranslate("message.relay.save_success"))

        navigation.reset({
            index: 2,
            routes: [
                { name: "home" },
                { name: "user-menu" },
                { name: "manage-relays" }
            ]
        })
    }

    return (
        <View style={{ flex: 1 }}>
            <HeaderScreen 
                title={useTranslate("labels.relays.add")} 
                onClose={() => navigation.goBack()}
            />

            <SearchBox
                seachOnLenth={0}
                loading={loading}
                label={useTranslate("commons.search")} 
                onSearch={handleSearch}
            />

            <RelayList relays={relays} onPressRelay={handleOpenRelay} />
            
            <TransparentLoader active={fetching} />
            <MessageBox />
        </View>
    )
}

export default AddRelayScreen
