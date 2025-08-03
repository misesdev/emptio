import { useEffect, useState } from "react"
import useNDKStore from "@services/zustand/useNDKStore"
import { getNotificationPermission } from "@services/permissions"
import NostrFactory from "@services/nostr/NostrFactory"
import { DataBaseUtxo } from "@storage/database/DataBaseUtxo"
import { DataBaseEvents } from "@storage/database/DataBaseEvents"
import { DataBaseTransaction } from "@storage/database/DataBaseTransaction"

const useBootApp = () => {

    const { setNDK } = useNDKStore()
    const [loading, setLoading] = useState(true)

    useEffect(() => {  
        bootApp()
    }, [])

    const bootApp = async () => {

        const _factory = new NostrFactory()

        setNDK(await _factory.getNostrInstance())
        
        await getNotificationPermission() 
        
        DataBaseUtxo.migrate()
        DataBaseEvents.migrate()
        DataBaseTransaction.migrate()
    
        setLoading(false)
    }

    return {
        loading
    }
}

export default useBootApp
