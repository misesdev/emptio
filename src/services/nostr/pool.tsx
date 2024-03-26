import { finalizeEvent, verifyEvent } from "nostr-tools"
import { hexToBytes } from "@noble/hashes/utils"
import { User } from "../memory/types"
import { getNostrEvents, publishEvent } from "./events"

export const getUserData = async (publicKey: string): Promise<User> => {

    const response: User = {}

    const events = await getNostrEvents({ authors: [publicKey], kinds: [0] }, publicKey)

    events.forEach(event => {
        const content = JSON.parse(event.content)

        if (content?.name)
            response.name = content.name
        if (content?.display_name)
            response.display_name = content.display_name
        if (content?.displayName)
            response.displayName = content.displayName
        if (content?.picture)
            response.picture = content.picture
        if (content?.about)
            response.about = content.about
        if (content?.lud16)
            response.lud16 = content.lud16
        if (content?.banner)
            response.banner = content.banner
    })

    return response;
}

export const pushUserData = async (user: User) => {

    const secretKey = user.privateKey ? user.privateKey : ""

    const content = {
        name: user.name,
        display_name: user.display_name,
        displayName: user.displayName,
        picture: user.picture,
        about: user.about,
        lud16: user.lud16,
        banner: user.banner
    }

    const event = finalizeEvent({
        kind: 0,
        content: JSON.stringify(content),
        created_at: Math.floor(Date.now() / 1000),
        tags: []
    }, hexToBytes(secretKey))

    const valid = verifyEvent(event)

    if (valid)
        await publishEvent(event)
}
