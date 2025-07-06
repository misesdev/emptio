import { BaseStorage } from "../base/BaseStorage";
import { NostrRelay } from "./types";

export class RelayStorage extends BaseStorage<NostrRelay>
{
    constructor() {
        super("relays")
        super.notFoundMessage = "Relay not found"
    }
}
