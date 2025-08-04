import { NostrRelay } from "./types/NostrRelay";

export interface IRelayService
{
    list(): Promise<NostrRelay[]>;
    add(relayUrl: string): Promise<void>;
    update(relay: NostrRelay): Promise<void>;
    delete(relayUrl: string): Promise<void>;
    search(searchTerm: string, limit?: number): Promise<NostrRelay[]>;
}
