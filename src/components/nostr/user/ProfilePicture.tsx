import { User } from "@services/memory/types"
import { getColorFromPubkey } from "@src/utils"
import { useEffect, useState } from "react"
import { StyleSheet, Image } from "react-native"
import theme from "@src/theme"

interface PictureProps {
    user: User,
    size: number,
    withBorder?: boolean
}

export const ProfilePicture = ({ user, size, withBorder=true }: PictureProps) => {
    
    const [profileError, setProfileError] = useState<boolean>(false)
    const [profileColor, setProfileColor] = useState(theme.colors.transparent)

    useEffect(() => {
        if(withBorder) {
            setProfileColor(getColorFromPubkey(user.pubkey??""))
        }
    }, [user])

    return (
        <Image onError={() => setProfileError(true)}
            style={[styles.profile, { width: size, height: size, borderColor: profileColor }]}
            source={(profileError || !user.picture) ? require("@assets/images/defaultProfile.png")
                : { uri: user.picture }
            } 
        />
    )
}

const styles = StyleSheet.create({
    profile: { borderRadius: 50, borderWidth: 2, overflow: "hidden" } 
})

