import useNDKStore from "@services/zustand/useNDKStore"
import { NDKRelay } from "@nostr-dev-kit/ndk-mobile"
import { useEffect, useState } from "react"

interface RelayData {
    all: NDKRelay[],
    connected: NDKRelay[]
    disconected: NDKRelay[]
}


const useRelaySettings = ({ navigation }: any) => {
    
    const { ndk } = useNDKStore()
    const [relayData, setRelayData] = useState<RelayData>()

    useEffect(() => {
        const relays: NDKRelay[] = Array.from(ndk.pool.relays.values())
        let connected_relays = relays.filter(r => r.connected) 
        let disconnected_relays = relays.filter(r => !r.connected)
        setRelayData({
            connected: connected_relays,
            disconected: disconnected_relays,
            all: relays
        })
    }, [])

    const openRelay = (relay: NDKRelay) => {
        navigation.navigate("manage-relay", { relay })
    }

    return {
        relayData,
        openRelay
    }
}

export default useRelaySettings


