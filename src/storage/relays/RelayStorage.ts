import { NostrRelay } from "@services/relays/types/NostrRelay";
import { BaseStorage } from "../base/BaseStorage";

export class RelayStorage extends BaseStorage<NostrRelay>
{
    constructor() {
        super("relays")
        super.notFoundMessage = "Relay not found"
    }
}
