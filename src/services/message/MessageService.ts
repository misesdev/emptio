import { DataBaseEvents } from "@storage/database/DataBaseEvents";
import { PrivateKeyStorage } from "@storage/pairkeys/PrivateKeyStorage";
import { IMessageService, MessageProps } from "./IMessageService";
import { AppResponse, trackException } from "../telemetry";
import { ChatUser } from "../zustand/useChatStore";
import NDK, { NDKEvent } from "@nostr-dev-kit/ndk-mobile";
import useNDKStore from "../zustand/useNDKStore";
import { User } from "../user/types/User";
import { TimeSeconds } from "../converter/TimeSeconds";
import { Utilities } from "@/src/utils/Utilities";

export class MessageService implements IMessageService 
{
    private readonly _ndk: NDK;
    private readonly _user: User;
    private readonly _dbevents: DataBaseEvents;
    private readonly _privatekey: PrivateKeyStorage;
    constructor(
        user: User,
        ndk: NDK = useNDKStore.getState().ndk,
        dbevents: DataBaseEvents = new DataBaseEvents(),
        privatekey: PrivateKeyStorage = new PrivateKeyStorage()
    ) {
        this._user = user
        this._dbevents = dbevents
        this._privatekey = privatekey
        this._ndk = ndk
    }

    public async setRelays(relays: string[]): Promise<void> 
    {
        relays.forEach(relay => this._ndk.addExplicitRelay(relay))
        await this._ndk.connect()
    }

    public async listChats(): Promise<AppResponse<ChatUser[]>> 
    {
        try 
        {
            const chats = await this._dbevents.listChats()
            chats.forEach(chat => { 
                if(chat.lastMessage.pubkey === this._user.pubkey) 
                    chat.lastMessage.pubkey = Utilities.pubkeyFromTags(chat.lastMessage)[0] 
            })
            return { success: true, data: Utilities.orderChats(chats) }
        } catch(ex) {
            return trackException(ex)
        }
    }

    public async deleteChats(chatIds: string[]): Promise<void>
    {
        for(let id of chatIds)
        {
            await this._dbevents.deleteByCondition(`chat_id = ?`, [id])
        }
    }

    public async listMessages(chatId: string): Promise<AppResponse<NDKEvent[]>> 
    {
        try 
        {
            const messages = await this._dbevents.listMessages(chatId)
            return {
                data: Utilities.orderEvents(messages), 
                success: true
            }
        } 
        catch(ex) {
            return trackException(ex)
        }
    }

    public async delete(events: NDKEvent[], onlyForMe: boolean = false): Promise<void>
    {
        await Promise.all(events.map(event => {
            return this._dbevents.deleteByCondition("id = ?", [event.id])
        }))

        if(!onlyForMe) {
            const myEvents = events.filter(e => e.pubkey === this._user.pubkey)
            Promise.all(myEvents.map(event => {
                return new Promise<void>(async (resolve) => {
                    try {
                        const deleteEvent = new NDKEvent(this._ndk, {
                            kind: 5,
                            pubkey: this._user.pubkey,
                            content: "deleting event",
                            tags: [["e", event.id]],
                            created_at: TimeSeconds.now()
                        })
                        await deleteEvent.publish()
                        resolve()
                    }
                    catch { resolve() }
                })
            }))
        }
    }

    public async encrypt(pubkey: string, event: NDKEvent): Promise<NDKEvent>
    {
        // const stored = await this._privatekey.get(this._user.keyRef)
        // if(event.pubkey == this._user.pubkey) {
        //     event.content = nip04.
        // }
        await event.encrypt()
        return event
    }

    public async decrypt(event: NDKEvent): Promise<NDKEvent> 
    {
        // const stored = await this._privatekey.get(this._user.keyRef)
        // if(event.pubkey == this._user.pubkey) {
        //     event.content = nip04.
        // }
        await event.decrypt()
        await this._dbevents.updateContent(event)
        return event
    }

    public async send({ pubkey, message, forward=false }: MessageProps): Promise<NDKEvent> 
    {
        const tags = [["p", pubkey]]
        if(forward) tags.push(["f", "forward"])
        const event = new NDKEvent(this._ndk, {
            kind: 4,
            pubkey: this._user.pubkey,
            created_at: TimeSeconds.now(),
            content: message,
            tags
        })
        await event.publishReplaceable()
        return event
    }
}

