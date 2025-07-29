import { NDKEvent } from "@nostr-dev-kit/ndk-mobile"
import { Utilities } from "./Utilities"

export class ChatUtilities
{
    public static chatIdFromEvent(event: NDKEvent): string 
    {
        const pubkeys: string[] = [event.pubkey, Utilities.pubkeyFromTags(event)[0]]
        return this.chatIdFromPubkeys(pubkeys)
    }

    public static chatIdFromPubkeys(pubkeys: string[]): string 
    {
        if(pubkeys.length < 2)
            throw new Error("Expected 2 pubkeys to generate chat id")
        let chatId: string = ""
        chatId = pubkeys[0].substring(0, 30) + pubkeys[1].substring(0, 30)
        chatId = chatId.match(/.{1,2}/g)!.sort().join("")
        return chatId
    }
}
