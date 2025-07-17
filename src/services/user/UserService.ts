import { EventKinds } from "@/src/constants/Events";
import NoteService from "../nostr/note/NoteService";
import { IUserService, ListFollowsProps, SearchUserProps,
    UpdateProfileProps } from "./IUserService";
import NDK, { NostrEvent } from "@nostr-dev-kit/ndk-mobile";
import { UserStorage } from "@storage/user/UserStorage";
import { timeSeconds } from "../converter";
import { User } from "./types/User";
import useNDKStore from "../zustand/useNDKStore";

class UserService implements IUserService
{
    private readonly _ndk: NDK;
    private _profile: User|null = null;
    private readonly _note: NoteService;
    private readonly _storage: UserStorage;
        
    constructor(ndk: NDK = useNDKStore.getState().ndk) {
        this._ndk = ndk
        this._note = new NoteService(ndk)
        this._storage = new UserStorage()
    }

    public async init(): Promise<void> {
        const user = await this._storage.get();
        if (!user?.pubkey) throw new Error("User not found or missing pubkey");
        this._profile = user;
    }

    public async fetchUser(pubkey: string): Promise<void> {
        const event = await this._note.getNote({
            authors: [pubkey], 
            kinds: [EventKinds.metadata], 
            limit: 1 
        })
        if(!event) throw new Error("profile event not found")
        this._profile = {
            pubkey: event.pubkey,
            ...JSON.parse(event.content)
        } as User
    }

    public async getProfile(): Promise<User> {
        if (!this._profile) throw new Error("UserService not initialized");
        return this._profile
    }

    public async updateProfile({ user, setUser, upNostr }: UpdateProfileProps): Promise<void> {
        if (!this._profile)
            throw new Error("UserService not initialized");
        this._profile = { ...this._profile, ...user }
        if(upNostr) await this.publishProfile()
        await this._storage.set(this._profile)
        if (setUser) setUser(this._profile)
    }

    public async publishProfile(): Promise<void> {
        if (!this._profile?.pubkey) throw new Error("UserService not initialized");
        const note: NostrEvent = {
            kind: EventKinds.metadata,
            pubkey: this._profile.pubkey as string,
            content: JSON.stringify(this._profile),
            created_at: timeSeconds.now(),
            tags: []
        }
        await this._note.publish({ 
            replaceable: true, 
            note
        })
    }

    public async listFollows({ follows, iNot=true }: ListFollowsProps): Promise<User[]> {
        if (!this._profile?.pubkey) throw new Error("UserService not initialized");
        const authors = follows?.tags?.filter(t => t[0] == "p").map(t => t[1])
        const events = await this._note.listNotes({ authors, kinds: [0], limit: authors?.length })
        let friends = Array.from(events??[])
            .filter((u: NostrEvent) => u.pubkey != this._profile?.pubkey)
            .map((event: NostrEvent): User => {
                const follow = JSON.parse(event.content) as User
                follow.pubkey = event.pubkey
                return follow
            })
        return iNot ? friends.filter(f => f.pubkey != this._profile?.pubkey)
            : friends
    }

    public async updateFollows(follows: NostrEvent): Promise<void> {
        return await this._note.publish({ 
            replaceable: true, 
            note: follows 
        })
    }

    public createFollows(friends: [string[]]): NostrEvent {
        if (!this._profile?.pubkey) throw new Error("UserService not initialized");
        return {
            kind: EventKinds.followList,
            pubkey: this._profile.pubkey,
            content: JSON.stringify(this._ndk.explicitRelayUrls),
            created_at: timeSeconds.now(),
            tags: friends
        } as NostrEvent 
    }

    public async lastNotes(limit: number = 3): Promise<NostrEvent[]> {
        if (!this._profile?.pubkey) throw new Error("UserService not initialized");
        const notes = await this._note.listNotes({
            kinds: [1],
            authors: [this._profile.pubkey as string],
            limit
        })
        return notes.filter(e => !e.tags.filter(t => t[0] == "e").length)
    }

    public async listUsers(authors: string[]): Promise<User[]> {
        const notes = await this._note.listNotes({
            kinds: [1], authors, limit: authors.length
        })
        if(notes) {
            return notes.map(event => {
                const user = {
                    ...JSON.parse(event.content) as User,
                    pubkey: event.pubkey
                }
                return user
            })
        }
        return []
    }

    public async searchUser({ searchTerm, limit }: SearchUserProps): Promise<User[]> {
        try 
        {
            if (!this._profile?.pubkey) 
                throw new Error("UserService not initialized");
            let defaultPubkey = process.env.DEFAULT_PUBKEY 
            const response = await fetch(`${process.env.NOSBOOK_API_URL}/search`, {
                method: "post",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pubkey: this._profile.pubkey ?? defaultPubkey,
                    searchTerm,
                    limit
                })
            })

            if(!response.ok) 
                throw new Error("an unexpected error occurred during the request")
            
            const users: any = await response.json()
            return users.filter((u: any) => u.pubkey != this._profile?.pubkey)
                .sort((a:any, b:any) => (b.similarity ?? 1) - (a.similarity ?? 1))
                .map((user: any) => {
                    return {
                        name: user.name,
                        pubkey: user.pubkey,
                        picture: user.profile,
                        display_name: user.displayName
                    }
                })
        }
        catch {
            return [] 
        }
    }

    public async save(): Promise<void> {
        if (!this._profile?.pubkey) 
            throw new Error("UserService not initialized");
        await this._storage.set(this._profile)
    }
}

export default UserService
