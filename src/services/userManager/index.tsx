import { clearStorage, getUser, insertUser } from "../memory"
import { createPairKeys, getHexKeys } from "../nostr"
import { getUserData, pushUserData } from "../nostr/pool"
import { User } from "../memory/types"
import { listenerEvents } from "../nostr/events"

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

        await insertUser(userData)

        return { success: true }
    }
    catch (ex) {
        console.log(ex)
        return { success: false, message: ex }
    }
}

export const SignIn = async (secretKey: string) => {

    try {
        const { privateKey, publicKey } = getHexKeys(secretKey)

        const userData = await getUserData(publicKey)

        userData.privateKey = privateKey

        await insertUser(userData)

        return { success: true }
    }
    catch (ex) {
        console.log(ex)
        return { success: false, message: ex }
    }
}

export const UpdateUserProfile = async () => {

    const userProfile: User = await getUser()

    const event = (await listenerEvents({ limit: 5, kinds: [0], authors: [userProfile.publicKey] }))[0]

    const content = JSON.parse(event.content)

    userProfile.displayName = content.displayName
    userProfile.picture = content.picture
    userProfile.image = content.image
    userProfile.banner = content.banner
    userProfile.lud06 = content.lud06
    userProfile.lud16 = content.lud16
    userProfile.nip05 = content.nip05
    userProfile.bio = content.bio
    userProfile.name = content.name
    userProfile.website = content.website
    userProfile.about = content.about
    userProfile.zapService = content.zapService

    await insertUser(userProfile)
}

export const SignOut = async () => {

    try {
        await clearStorage()
        await clearStorage()
        await clearStorage()
        return { success: true }
    } catch (ex) {
        return { success: false, message: ex }
    }
}

