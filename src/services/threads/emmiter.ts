import { NDKEvent } from "@nostr-dev-kit/ndk"
import { ChatUser } from "../zustand/chats"

type EmmiterProps = {
    event: NDKEvent,
    addChat: (chat: ChatUser) => void
}



