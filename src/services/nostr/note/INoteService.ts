import { NDKEvent, NDKFilter, NostrEvent } from "@nostr-dev-kit/ndk-mobile"

export type ReactionProps = { note: NDKEvent; reaction: string; }
export type ListReactionProps = { note: NDKEvent; }
export type ListCommentProps = { note: NDKEvent; timeout: number; }
export type PublishNoteProps = { note: NostrEvent; replaceable: boolean; }

export interface INoteService {
    reactNote(props: ReactionProps) : Promise<NDKEvent>;
    listReactions(props: ListReactionProps) : Promise<NDKEvent[]>;
    deleteReact(note: NDKEvent) : Promise<NDKEvent>;
    listComments(props: ListCommentProps) : Promise<NDKEvent[]>;
    publish(props: PublishNoteProps) : Promise<void>;
    listNotes(filters: NDKFilter): Promise<NDKEvent[]>;
    getNote(filters: NDKFilter) : Promise<NDKEvent|null>;
    getPubkeyFromTags(event: NDKEvent) : string|null;
}
