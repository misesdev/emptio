import { useEffect, useState } from "react"
import { RelayItem } from "./RelayItem"
import { ActivityIndicator } from "react-native"
import theme from "@/src/theme"

export const RelayList = () => {

    const [loading, setLoading] = useState<boolean>(true)
    const [relays, setRelays] = useState<Array<string>>()

    useEffect(() => {
        setRelays(Nostr.explicitRelayUrls)
        setTimeout(() => setLoading(false), 800)
    }, [])

    if(loading)
        return <ActivityIndicator color={theme.colors.gray} style={{ margin: 10 }} size={50} />

    return (
        <>
            {relays && relays.map((relay, key) => <RelayItem key={key} relay={relay} />)}
        </>
    )
}