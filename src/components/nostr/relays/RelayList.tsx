import { View } from "react-native"
import { RelayItem } from "./RelayItem"

type Props = {
    relays: string[],
    onDelete: (relay: string) => void
}

export const RelayList = ({ relays, onDelete }: Props) => {

    if (relays) {
        return (
            <View style={{ flex: 1 }}>
                {relays.map((relay) => <RelayItem key={relay} relay={relay} onDelete={onDelete} />)}
            </View>
        )
    }

    return <></>
}
