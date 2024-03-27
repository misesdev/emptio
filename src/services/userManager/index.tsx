import { clearStorage, getUser, insertUser } from "../memory"
import { createPairKeys, getHexKeys } from "../nostr"
import { getUserData, pushUserData } from "../nostr/pool"
import { User } from "../memory/types"
import { getEvent } from "../nostr/events"

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

        insertUser(userData)

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

        insertUser(userData)

        return { success: true }
    }
    catch (ex) {
        console.log(ex)
        return { success: false, message: ex }
    }
}

export const UpdateUser = async () => {

    const user = await getUser()

    const event = await getEvent({ kinds: [0], authors: [user.publicKey] })

    const content = JSON.parse(event.content)

    user.displayName = content.displayName
    user.picture = content.picture
    user.image = content.image
    user.banner = content.banner
    user.lud06 = content.lud06
    user.lud16 = content.lud16
    user.nip05 = content.nip05
    user.bio = content.bio
    user.name = content.name
    user.website = content.website
    user.about = content.about
    user.zapService = content.zapService

    console.log("update profile")
    console.log(content)

    insertUser(user)
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

