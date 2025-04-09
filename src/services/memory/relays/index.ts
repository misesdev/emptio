import { DefaultRelays } from "../../../constants/Relays"
import AsyncStorage from "@react-native-async-storage/async-storage"

export class RelayStorage {
    private static relays = DefaultRelays

    static async add(relay: string) : Promise<void> {
        let relays = await this.list()
        relays.push(relay)
        await this.save(relays)
    }

    static async remove(relay: string) : Promise<void> {
        let relays = await this.list()
        await this.save(relays.filter(r => r != relay))
    }

    static async list() : Promise<string[]> {
        var relays = this.relays
        const data = await AsyncStorage.getItem("relays")
        if(data)
            relays = JSON.parse(data) as string[]
        return relays
    }

    private static async save(relays: string[]) : Promise<void> {
        await AsyncStorage.setItem("relays", JSON.stringify(relays))
    }
}


