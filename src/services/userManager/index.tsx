import { clearStorage } from "../memory"
import { createPairKeys, getHexKeys } from "../nostr"
import { getUserData, pushUserData } from "../nostr/pool"
import { PairKey, User } from "../memory/types"
import { listenerEvents } from "../nostr/events"
import { Response, trackException } from "../telemetry/telemetry"
import { getUser, insertUpdateUser } from "../memory/user"
import { getPairKey, insertPairKey } from "../memory/pairkeys"

export const SignUp = async (userName: string, setUser: (user: User) => void): Promise<Response> => {
    try {

        const pairKey: PairKey = createPairKeys()

        const userData: User = {
            name: userName.trim(),
            displayName: userName.trim(),
            keychanges: pairKey.key,
        }

        await pushUserData(userData, pairKey)

        userData.keychanges = pairKey.key

        await insertUpdateUser(userData)

        setUser(userData)

        return { success: true, message: "" }
    }
    catch (ex) {
        return trackException(ex)
    }
}

export const SignIn = async (secretKey: string, setUser: (user: User) => void) => {

    try {
        const pairKey: PairKey = getHexKeys(secretKey)

        const userData = await getUserData(pairKey.publicKey)

        userData.keychanges = pairKey.key

        await insertUpdateUser(userData)

        await insertPairKey(pairKey)

        setUser(userData)

        return { success: true }
    }
    catch (ex) {
        return trackException(ex)
    }
}

type UpdateProfileProps = {
    user: User,
    setUser: (user: User) => void
}

export const UpdateUserProfile = async ({ user, setUser }: UpdateProfileProps) => {

    const pairKey: PairKey = await getPairKey(user.keychanges ?? "")

    const event = (await listenerEvents({ limit: 5, kinds: [0], authors: [pairKey.publicKey] }))[0]

    user.displayName = event.content?.displayName
    user.picture = event.content?.picture
    user.image = event.content?.image
    user.banner = event.content?.banner
    user.lud06 = event.content?.lud06
    user.lud16 = event.content?.lud16
    user.nip05 = event.content?.nip05
    user.bio = event.content?.bio
    user.name = event.content?.name
    user.website = event.content?.website
    user.about = event.content?.about
    user.zapService = event.content?.zapService

    await insertUpdateUser(user)

    setUser(user)
}

export const SignOut = async () : Promise<Response> => {

    try {
        await clearStorage()

        return { success: true, message: "" }
    } 
    catch (ex) {
        return trackException(ex)
    }
}

export const IsLogged = async (setUser: (user: User) => void) => {
    
    const user: User = await getUser()

    const { privateKey } = await getPairKey(user.keychanges ?? "")

    if(!!privateKey)
        setUser(user)

    return !!privateKey
}
