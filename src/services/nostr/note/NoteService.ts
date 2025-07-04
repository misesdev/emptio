import NDK, { NDKEvent, NDKFilter, NDKSubscriptionCacheUsage, NostrEvent } from "@nostr-dev-kit/ndk-mobile"
import { INoteService, ListCommentProps, ListReactionProps, PublishNoteProps, 
    ReactionProps } from "./INoteService"
import { jsonContentKinds } from "@/src/constants/Events"
import useNDKStore from "@services/zustand/ndk"
import { timeSeconds } from "../../converter";

class NoteService implements INoteService
{
    private readonly _ndk: NDK;

    constructor(ndk?: NDK) {
        this._ndk = ndk ?? useNDKStore.getState().ndk
    }

    public async listReactions({ user, note }: ListReactionProps): Promise<NDKEvent[]> {
        const filter: NDKFilter = { kinds:[7], "#e": [note.id] }
        if(user) filter.authors = [user.pubkey??""]
        const events = await this._ndk.fetchEvents(filter, {
            cacheUsage: NDKSubscriptionCacheUsage.ONLY_RELAY
        })
        return Array.from(events)
    }

    public async reactNote({ note, reaction }: ReactionProps) : Promise<NDKEvent> {
        if(!note.ndk) note.ndk = this._ndk
        return await note.react(reaction)
    }

    public async deleteReact(note: NDKEvent): Promise<NDKEvent> {
        if(!note.ndk) note.ndk = this._ndk
        return await note.delete()
    }

    public async listComments({ note, timeout=800 }: ListCommentProps): Promise<NDKEvent[]> {
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

    public async publish({ note, replaceable=false }: PublishNoteProps): Promise<void> {
        const event = new NDKEvent(this._ndk);
        event.kind = note.kind
        event.pubkey = note.pubkey ?? ""
        event.content = typeof(note.content) == "string" ? 
            note.content : JSON.stringify(note.content)
        event.created_at = note.created_at
        event.tags = note.tags ?? [[]]
        await event.sign()
        if(replaceable)
            await event.publishReplaceable()

        await event.publish()
    }

    public async listNotes(filters: NDKFilter): Promise<NostrEvent[]> {
        const events = await this._ndk.fetchEvents(filters, {
            cacheUsage: NDKSubscriptionCacheUsage.ONLY_RELAY
        })

        return Array.from(events).map((event) : NostrEvent => {
            let jsonContent = jsonContentKinds.includes(event.kind ?? 0)
            return {
                id: event.id,
                kind: event.kind,
                pubkey: event.pubkey,
                content: jsonContent ? JSON.parse(event.content) : event.content,
                created_at: event.created_at ?? timeSeconds.now(),
                tags: event.tags
            } 
        })
    }

    public async getNote(filters: NDKFilter): Promise<NostrEvent|null> {
        const event = await this._ndk.fetchEvent(filters, {
            cacheUsage: NDKSubscriptionCacheUsage.ONLY_RELAY
        })
        if(event) {
            let jsonContent = jsonContentKinds.includes(event.kind ?? 0)
            return { 
                id: event.id,
                kind: event.kind,
                pubkey: event.pubkey,
                content: jsonContent ? JSON.parse(event.content) : event.content,
                created_at: event.created_at ?? 0,
                tags: event.tags
            } as NostrEvent
        }
        return null 
    }

    public getPubkeyFromTags(event: NDKEvent) : string|null {
        const pubkeys = event.tags.filter(t => t[0] == "p").map(t => t[1])
        if(pubkeys.length)
            return pubkeys[0]
        return null
    }
}

export default NoteService

