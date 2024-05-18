import { RelayItem } from "./RelayItem"

type Props = {
    relays: string[],
    onDelete: (relay: string) => void
}

export const RelayList = ({ relays, onDelete }: Props) => {

    if (relays)
        return relays.map((relay) => <RelayItem key={relay} relay={relay} onDelete={onDelete} />)
}