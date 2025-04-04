import { HeaderScreen } from "@components/general/HeaderScreen"
import { useTranslateService } from "@src/providers/translateProvider"
import { RelayList } from "@components/nostr/relays/RelayList"
import { SearchBox } from "@components/form/SearchBox"
import { storageService } from "@services/memory"
import { useEffect, useState } from "react"
import MessageBox from "@components/general/MessageBox"
import { View } from "react-native"

const AddRelayScreen = ({ navigation }: any) => {

    const { useTranslate } = useTranslateService()
    const [relays, setRelays] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {  handleSearch("relay") }, [])

    const handleSearch = async (searchTerm: string) => {

        setLoading(true)

        const all_relays: string[] = await storageService.relays.list()
        const result: string[] = await storageService.relays.search(searchTerm) 
        setRelays(result.filter(r => !all_relays.includes(r)))
        
        setLoading(false)
    }

    const handleOpenRelay = (relay: string) => {

    }

    const handleAdd = (relay: string) => {
        console.log(relay)
    }

    return (
        <View style={{ flex: 1 }}>
            <HeaderScreen 
                title={useTranslate("labels.relays.add")} 
                onClose={() => navigation.goBack()}
            />

            <SearchBox
                seachOnLenth={1}
                loading={loading}
                label={useTranslate("commons.search")} 
                onSearch={handleSearch}
            />

            <RelayList relays={relays} onPressRelay={handleOpenRelay} />

            <MessageBox />
        </View>
    )
}

export default AddRelayScreen
