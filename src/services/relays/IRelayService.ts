import { NostrRelay } from "./types/NostrRelay";

export interface IRelayService
{
    list(): Promise<NostrRelay[]>;
    update(relay: NostrRelay): Promise<void>;
    search(searchTerm: string, limit?: number): Promise<NostrRelay[]>;
}
