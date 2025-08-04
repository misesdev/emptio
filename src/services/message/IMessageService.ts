import { NDKEvent } from "@nostr-dev-kit/ndk-mobile";
import { AppResponse } from "../telemetry";
import { ChatUser } from "../zustand/useChatStore";

export type SendMessageProps = {
    message: string; receiver: string; replyEvent?: NDKEvent|null; forward?: boolean;
}

export interface IMessageService 
{
    setRelays(relays: string[]): Promise<void>;
    listChats(): Promise<AppResponse<ChatUser[]>>;
    deleteChats(chatIds: string[]): Promise<void>;
    listMessages(chatId: string): Promise<AppResponse<NDKEvent[]>>;
    delete(event: NDKEvent[], onlyForMe?: boolean): Promise<void>;

    encrypt(pubkey: string, event: NDKEvent): Promise<NDKEvent>;
    decrypt(event: NDKEvent): Promise<NDKEvent>;
    send(props: SendMessageProps): Promise<NDKEvent>;
}
