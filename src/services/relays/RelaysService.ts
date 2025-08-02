import { RelayStorage } from "@/src/storage/relays/RelayStorage";
import { NostrRelay } from "./types/NostrRelay";
import { IRelayService } from "./IRelayService";

class RelaysService implements IRelayService
{
    private readonly _storage: RelayStorage;
    constructor(
        storage: RelayStorage = new RelayStorage()
    ) {
        this._storage = storage
    }

    public async list(): Promise<NostrRelay[]>
    {
        return await this._storage.listEntities()
    }

    public async search(searchTerm: string, limit: number = 100): Promise<NostrRelay[]>
    {
        try 
        {
            const response = await fetch(`${process.env.NOSBOOK_API_URL}/relays/search`, {
                method: "post",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    searchTerm,
                    limit
                })
            })

            if(!response.ok) 
                throw new Error("an unexpected error occurred during the request")
            
            const result: any[] = await response.json()

            return result.sort((a, b) => (b.similarity ?? 1) - (a.similarity ?? 1))
                .map((data: any): NostrRelay => {
                    return { url: data.relay }
                })
        }
        catch {
            return [] 
        }
    }
}

export default RelaysService
