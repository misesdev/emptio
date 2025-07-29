import { NostrRelay } from "./types/NostrRelay";

export interface IRelayService
{
    list(): Promise<NostrRelay[]>;
    search(searchTerm: string, limit?: number): Promise<NostrRelay[]>;
}
