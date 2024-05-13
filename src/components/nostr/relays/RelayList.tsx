import { useEffect } from "react"
import { RelayItem } from "./RelayItem"

type Props = {
    relays: string[],
    onDelete: (relay: string) => void
}

export const RelayList = ({ relays, onDelete }: Props) => {

    useEffect(() => {

    }, [relays])

    return (
        <>
            {relays && relays.map((relay, key) => <RelayItem key={key} relay={relay} onDelete={onDelete} />)}
        </>
    )
}