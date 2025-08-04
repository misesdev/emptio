import NDK, { NDKEvent, NDKFilter, NDKSubscriptionCacheUsage,
    NostrEvent } from "@nostr-dev-kit/ndk-mobile"
import { INoteService, ListCommentProps, ListReactionProps, PublishNoteProps, 
    ReactionProps } from "./INoteService"
import useNDKStore from "@services/zustand/useNDKStore"
import { User } from "../../user/types/User";

class NoteService implements INoteService
{
    private readonly _ndk: NDK;
    private readonly _user?: User;

    constructor(
        user: User|undefined = undefined,
        ndk: NDK = useNDKStore.getState().ndk
    ) {
        this._user = user
        this._ndk = ndk 
    }

    public async listReactions({ note }: ListReactionProps): Promise<NDKEvent[]> 
    {
        const filter: NDKFilter = { kinds:[7], "#e": [note.id] }
        if(this._user) filter.authors = [this._user.pubkey??""]
        const events = await this._ndk.fetchEvents(filter, {
            cacheUsage: NDKSubscriptionCacheUsage.ONLY_RELAY
        })
        return Array.from(events)
    }

    public async reactNote({ note, reaction }: ReactionProps) : Promise<NDKEvent> 
    {
        if(!note.ndk) note.ndk = this._ndk
        return await note.react(reaction)
    }

    public async deleteReact(note: NDKEvent): Promise<NDKEvent> 
    {
        if(!note.ndk) note.ndk = this._ndk
        return await note.delete()
    }

    public async listComments({ note, timeout=800 }: ListCommentProps): Promise<NDKEvent[]>
    {
        return new Promise<NDKEvent[]>((resolve) => {
            try {
                const events: NDKEvent[] = []
                const filter: NDKFilter = { 
                    kinds: [1], "#p": [note.pubkey], "#e": [note.id] 
                }
                const subscription = this._ndk.subscribe(filter, { 
                    cacheUsage: NDKSubscriptionCacheUsage.ONLY_RELAY 
                })
                subscription.on("event", note => {
                    events.push(note)
                })
                const finish = () => resolve(events)
                subscription.on("eose", finish)
                subscription.on("close", finish) 
                setTimeout(() => {
                    subscription.stop()
                }, timeout)
            }
            catch(ex) {
                console.log(ex)
                resolve([]) 
            }
        })
    }

    public async publish({ note, replaceable=false }: PublishNoteProps): Promise<void>
    {
        const content = typeof(note.content) == "string" ? 
            note.content : JSON.stringify(note.content)  
        const event = new NDKEvent(this._ndk, {
            kind: note.kind,
            pubkey: note.pubkey,
            content: content,
            created_at: note.created_at,
            tags: note.tags ?? [[]]
        });
        await event.sign()
        if(replaceable)
            await event.publishReplaceable()

        await event.publish()
    }

    public async listNotes(filters: NDKFilter): Promise<NDKEvent[]> 
    {
        const events = await this._ndk.fetchEvents(filters, {
            cacheUsage: NDKSubscriptionCacheUsage.ONLY_RELAY
        })
        return Array.from(events) 
    }

    public async getNote(filters: NDKFilter): Promise<NDKEvent|null> 
    {
        const event = await this._ndk.fetchEvent(filters, {
            cacheUsage: NDKSubscriptionCacheUsage.ONLY_RELAY
        })
        return event 
    }

    public getPubkeyFromTags(event: NDKEvent) : string|null
    {
        const pubkeys = event.tags.filter(t => t[0] == "p").map(t => t[1])
        if(pubkeys.length)
            return pubkeys[0]
        return null
    }
}

export default NoteService

