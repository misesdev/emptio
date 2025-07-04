import { NDKEvent, NostrEvent } from "@nostr-dev-kit/ndk-mobile";
import { User } from "./types/User"

export type SearchUserProps = {
    searchTerm: string; limit: number;
}
export type UpdateProfileProps = {
    user: User, setUser?: (user: User) => void; upNostr?: boolean;
}
export type ListFollowsProps = {
    follows?: NostrEvent; iNot: boolean;
}

export interface IUserService {
    getProfile(): Promise<User>;
    updateProfile(props: UpdateProfileProps): Promise<void>;
    listFollows(props: ListFollowsProps): Promise<User[]>;
    updateFollows(follows: NostrEvent) : Promise<void>;
    createFollows(friends: [string[]]) : NostrEvent;
    lastNotes(limit: number) : Promise<NostrEvent[]>;
    
    listUsers(pubkeys: string[]): Promise<User[]>;
    searchUser(props: SearchUserProps): Promise<User[]>;
}
