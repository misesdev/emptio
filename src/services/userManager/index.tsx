import { clearStorage } from "../memory"
import { createPairKeys, getHexKeys } from "../nostr"
import { getUserData, pushUserData } from "../nostr/pool"
import { User } from "../memory/types"
import { listenerEvents } from "../nostr/events"
import { Response, trackException } from "../telemetry/telemetry"
import { getUser, insertUpdateUser } from "../memory/user"

export const SignUp = async (userName: string) => {
    try {

        const { privateKey, publicKey } = createPairKeys()

        const userData: User = {
            name: userName.trim(),
            displayName: userName.trim(),
            privateKey: privateKey,
            publicKey: publicKey ? publicKey : ""
        }

        await pushUserData(userData)

        await insertUpdateUser(userData)

        return { success: true }
    }
    catch (ex) {
        return trackException(ex)
    }
}

export const SignIn = async (secretKey: string) => {

    try {
        const { privateKey, publicKey } = getHexKeys(secretKey)

        const userData = await getUserData(publicKey)

        userData.privateKey = privateKey

        await insertUpdateUser(userData)

        return { success: true }
    }
    catch (ex) {
        return trackException(ex)
    }
}

export const UpdateUserProfile = async () => {

    const userProfile: User = await getUser()

    const event = (await listenerEvents({ limit: 5, kinds: [0], authors: [userProfile.publicKey] }))[0]

    userProfile.displayName = event.content?.displayName
    userProfile.picture = event.content?.picture
    userProfile.image = event.content?.image
    userProfile.banner = event.content?.banner
    userProfile.lud06 = event.content?.lud06
    userProfile.lud16 = event.content?.lud16
    userProfile.nip05 = event.content?.nip05
    userProfile.bio = event.content?.bio
    userProfile.name = event.content?.name
    userProfile.website = event.content?.website
    userProfile.about = event.content?.about
    userProfile.zapService = event.content?.zapService

    await insertUpdateUser(userProfile)
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

export const IsLogged = async () => {
    
    const { privateKey } = await getUser()

    return !!privateKey
}
