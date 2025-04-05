import { HeaderScreen } from "@components/general/HeaderScreen"
import { useTranslateService } from "@src/providers/translateProvider"
import { RelayList } from "@components/nostr/relays/RelayList"
import { SearchBox } from "@components/form/SearchBox"
import { storageService } from "@services/memory"
import { useEffect, useState } from "react"
import MessageBox, { showMessage } from "@components/general/MessageBox"
import TransparentLoader from "@components/general/TransparentLoader"
import { pushMessage } from "@services/notification"
import useNDKStore from "@services/zustand/ndk"
import { View } from "react-native"
import axios from "axios"

const AddRelayScreen = ({ navigation }: any) => {

    const { ndk } = useNDKStore()
    const { useTranslate } = useTranslateService()
    const [relays, setRelays] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [fetching, setFetching] = useState<boolean>(false)

    useEffect(() => {  handleSearch("relay") }, [])

    const handleSearch = async (searchTerm: string) => {

        setLoading(true)

        if(!searchTerm.trim().length) {
            searchTerm = "relays"
        }

        const all_relays: string[] = await storageService.relays.list()
        
        const result: string[] = await storageService.relays.search(searchTerm.trim()) 
        
        setRelays(result.filter(r => !all_relays.includes(r)))
        
        setLoading(false)
    }

    const handleOpenRelay = async (relay: string) => {
        try {
            setFetching(true)

            const httpClient = axios.create({ headers: { Accept: "application/nostr+json" } })

            const response = await httpClient.get(relay.replace("wss", "https"))

            if (response.status != 200)
                throw new Error(useTranslate("message.relay.invalid"))
         
            setFetching(false)

            showMessage({
                title: useTranslate("labels.relays.add"),
                message: useTranslate("message.relay.adddetails"),
                infolog: relay,
                action: {
                    label: useTranslate("commons.add"),
                    onPress: async () => addRelay(relay)
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

        await storageService.relays.add(relay)

        await ndkRelay.connect()

        pushMessage(useTranslate("message.relay.save_success"))

        navigation.reset({
            index: 2,
            routes: [
                { name: "core-stack" },
                { name: "user-menu-stack" },
                { name: "manage-relays-stack" }
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
