import { NostrRelay } from "@services/relays/types/NostrRelay";
import { DefaultRelays } from "@src/constants/Relays";
import { BaseStorage } from "../base/BaseStorage";

export class RelayStorage extends BaseStorage<NostrRelay>
{
    constructor() {
        const defaults = DefaultRelays
            .map(r => { return { url: r} as NostrRelay })
        super("relays", defaults)
        super.notFoundMessage = "Relay not found"
    }
}
