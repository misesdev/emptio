import { SimplePool } from "nostr-tools"
import { getRelays } from "./relays"
import { User } from "../memory/types"

const relays = getRelays()

const getPool = (publicKey: string) => {
    const pool = new SimplePool()

    const h = pool.subscribeMany(
        relays,
        [
            {
                authors: [publicKey],
            },
        ],
        {
            onevent(event) {
                // this will only be called once the first time the event is received
                // ...
            },
            oneose() {
                h.close()
            }
        }
    )

    return pool
}

export const getUserData = async (publicKey: string): Promise<User> => {

    const response: User = {}

    const pool = getPool(publicKey)

    const events = await pool.querySync(relays, { authors: [publicKey], kinds: [0] })

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