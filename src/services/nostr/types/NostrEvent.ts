import { User } from "@services/user/types/User";

export interface NostrEvent {
    id?: string,
    kind?: number,
    pubkey?: string,
    content?: string | User,
    created_at?: number,
    tags?: string[][],
    sig?: string,
    status?: "new" | "viewed",
    chat_id?: string
}
