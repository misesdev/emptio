import { NDKEvent, NDKFilter, NostrEvent } from "@nostr-dev-kit/ndk-mobile"
import { User } from "@services/user/types/User";

export type ReactionProps = { note: NDKEvent; reaction: string; }
export type ListReactionProps = { user?: User; note: NDKEvent; }
export type ListCommentProps = { note: NDKEvent; timeout: number; }
export type PublishNoteProps = { note: NostrEvent; replaceable: boolean; }

export interface INoteService {
    reactNote(props: ReactionProps) : Promise<NDKEvent>;
    listReactions(props: ListReactionProps) : Promise<NDKEvent[]>;
    deleteReact(note: NDKEvent) : Promise<NDKEvent>;
    listComments(props: ListCommentProps) : Promise<NDKEvent[]>;
    publish(props: PublishNoteProps) : Promise<void>;
    listNotes(filters: NDKFilter) : Promise<NostrEvent[]>;
    getNote(filters: NDKFilter) : Promise<NostrEvent|null>;
    getPubkeyFromTags(event: NDKEvent) : string|null;
}
