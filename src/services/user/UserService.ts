import { EventKinds } from "@/src/constants/Events";
import NoteService from "../nostr/note/NoteService";
import { IUserService, ListFollowsProps, SearchUserProps, UpdateProfileProps } from "./IUserService";
import NDK, { NDKEvent, NostrEvent } from "@nostr-dev-kit/ndk-mobile";
import { timeSeconds } from "../converter";
import { User } from "./types/User";
import useNDKStore from "../zustand/ndk";

class UserService implements IUserService
{
    private _profile: User;
    private readonly _ndk: NDK;
    private readonly _note: NoteService;
    //private readonly _storage: AppStorage
        
    constructor(profile: User) {
        if(!profile.pubkey)
            throw new Error("Missing pubkey in profile")
        //this._storage = new AppStorage()
        this._ndk = useNDKStore.getState().ndk
        this._note = new NoteService(this._ndk)
        this._profile = profile
    }

    public async getProfile(): Promise<User> {
        const event = await this._note.getNote({
            authors: [this._profile.pubkey as string], 
            kinds: [EventKinds.metadata], 
            limit: 1 
        })
        const user = event?.content as User
        user.pubkey = this._profile.pubkey 
        return user
    }

    public async updateProfile({ user, setUser, upNostr }: UpdateProfileProps): Promise<void> {
        this.replaceProfile(user)
        if(upNostr) {
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
        //await storageService.user.save(user)
        if (setUser) setUser(user)
    }

    public async listFollows({ follows, iNot }: ListFollowsProps): Promise<User[]> {
        const authors = follows?.tags?.filter(t => t[0] == "p").map(t => t[1])
        const events = await this._note.listNotes({ authors, kinds: [0], limit: authors?.length })
        let friends = Array.from(events??[])
            .filter((u: NostrEvent) => u.pubkey != this._profile.pubkey)
            .map((event: NostrEvent): User => {
                const follow = event.content as User
                follow.pubkey = event.pubkey
                return follow
            })

        if (iNot) 
            return friends.filter(f => f.pubkey != this._profile.pubkey)

        return friends
    }

    public async updateFollows(follows: NostrEvent): Promise<void> {
        return await this._note.publish({ 
            note: follows, 
            replaceable: true 
        })
    }

    public createFollows(friends: [string[]]): NostrEvent {
        return {
            kind: EventKinds.followList,
            pubkey: this._profile.pubkey,
            content: JSON.stringify(this._ndk.explicitRelayUrls),
            created_at: timeSeconds.now(),
            tags: friends
        } as NostrEvent 
    }

    public async lastNotes(limit: number = 3): Promise<NostrEvent[]> {
        const notes = await this._note.listNotes({
            kinds: [1],
            authors: [this._profile.pubkey as string],
            limit
        })
        return notes.filter(e => !e.tags.filter(t => t[0] == "e").length)
    }

    public async listUsers(pubkeys: string[]): Promise<User[]> {
        const notes = await this._note.listNotes({
            kinds: [1],
            authors: pubkeys,
            limit: pubkeys.length
        })
        if(notes) {
            return notes.map(event => {
                const user = event.content as User
                user.pubkey = event.pubkey
                return user
            })
        }
        return []
    }

    public async searchUser({ searchTerm, limit }: SearchUserProps): Promise<User[]> {
        try 
        {
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
            return users.filter((u: any) => u.pubkey != this._profile.pubkey)
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

    private replaceProfile(user: User) {
        this._profile.name = user.name
        this._profile.displayName = user.displayName
        this._profile.display_name = user.display_name
        this._profile.zapService = user.zapService
        this._profile.picture = user.picture
        this._profile.image = user.image
        this._profile.banner = user.banner
        this._profile.lud06 = user.lud06
        this._profile.lud16 = user.lud16
        this._profile.nip05 = user.nip05
        this._profile.bio = user.bio
        this._profile.name = user.name
        this._profile.website = user.website
        this._profile.about = user.about
    }
}

export default UserService
