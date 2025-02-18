import SearchButton from "@components/form/SearchButton"
import { useAuth } from "@src/providers/userProvider"
import { TouchableOpacity, View, Image, StyleSheet } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useTranslateService } from "@src/providers/translateProvider"
import theme from "@src/theme"
import { useEffect, useState } from "react"
import { getColorFromPubkey } from "@/src/utils"

export const HeaderFeed = ({ navigation }: any) => {

    const { user } = useAuth()
    const { useTranslate } = useTranslateService()
    const [profileColor, setProfileColor] = useState(theme.colors.green)
    const [pictureError, setPictureError] = useState(false)
   
    useEffect(() => {
        setProfileColor(getColorFromPubkey(user.pubkey??""))
    }, [])

    return (
        <View style={styles.header}>
            <View style={{ width: "15%", alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity onPress={() => navigation.navigate("user-menu-stack")}>
                    <Image style={[styles.userMenu,{borderColor:profileColor}]}
                        onError={() => setPictureError(true)}
                        source={(pictureError || !user.picture) ? require("@assets/images/defaultProfile.png")
                            :{ uri: user?.picture }
                        } 
                    />
                </TouchableOpacity>
            </View>
            <View style={{ width: "70%", alignItems: "center", justifyContent: "center" }}>
                <SearchButton label={useTranslate("commons.search")} onPress={() => navigation.navigate("search-feed-stack")} />
            </View>
            <View style={{ width: "15%", alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity onPress={() => navigation.navigate("user-menu-stack")}>
                    <Ionicons name="documents" color={theme.colors.gray} size={theme.icons.extra} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: { width: "100%", flexDirection: "row", paddingVertical: 5,
        backgroundColor: theme.colors.black },
    userMenu: { width: 38, height: 38, borderWidth: 1, borderRadius: 50 }
})
