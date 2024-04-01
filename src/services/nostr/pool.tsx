import { PairKey, User } from "../memory/types"
import { listenerEvents, publishEvent } from "./events"

export const getUserData = async (publicKey: string): Promise<User> => {

    const event = (await listenerEvents({ authors: [publicKey], kinds: [0] }))[0]

    return event.content
}

export const pushUserData = async (user: User, pairKey: PairKey) => {

    const profile: User = {
        name: user.name,
        displayName: user.displayName,
        picture: user.picture,
        image: user.image,
        about: user.about,
        bio: user.bio,
        nip05: user.nip05,
        lud06: user.lud06,
        lud16: user.lud16,
        banner: user.banner,
        zapService: user.zapService,
        website: user.website,
    }

    const event = { kind: 0, content: JSON.stringify(profile) }

    await publishEvent(event, pairKey)
}
