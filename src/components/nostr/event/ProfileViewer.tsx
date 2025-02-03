import { User } from "@/src/services/memory/types"
import { StyleSheet, TouchableOpacity, Text } from "react-native"
import { getUserName } from "@/src/utils"
import { useEffect, useState } from "react"
import theme from "@/src/theme"
import { nip19 } from "nostr-tools"
import { userService } from "@/src/core/userManager"

type ScreenProps = {
    nprofile?: string,
    npub?: string
}
const ProfileViewer = ({ npub, nprofile }: ScreenProps) => {

    const [user, setUser] = useState<User>({})

    useEffect(() => {
        loadUserData()
    }, [])

    const loadUserData = async () => {
        try {
            if(npub) {
                const decoded:any = nip19.decode(npub)
                const userData = await userService.getProfile(decoded.data)
                setUser(userData)
            } else if (nprofile) {
                const decoded:any = nip19.decode(nprofile)
                const userData = await userService.getProfile(decoded.data.pubkey)
                setUser(userData)
            }
        } catch { }
    }

    if(!user.pubkey) 
        return <Text style={styles.profile}></Text>

    return <Text style={styles.profile}>@{getUserName(user)}</Text>
}

const styles = StyleSheet.create({
    profile: { color: theme.colors.blue }
})

export default ProfileViewer
