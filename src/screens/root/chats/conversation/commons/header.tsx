import { User } from "@/src/services/memory/types"
import theme from "@/src/theme"
import { copyPubkey, getColorFromPubkey, getDisplayPubkey, getUserName } from "@/src/utils"
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import { useEffect, useState } from "react"

type Props = {
    follow: User
}

const ConversationHeader = ({ follow }: Props) => {

    const [pictureError, setPictureError] = useState(false)
    const [profileColor, setProfileColor] = useState(theme.colors.green)

    useEffect(() => {
        setProfileColor(getColorFromPubkey(follow.pubkey??""))
    }, [])

    return (
        <View style={styles.headerContainer}>
            <View style={{ width: "16%", alignItems: "center", justifyContent: "center" }}>
                <View style={[styles.imageContainer,{borderColor: profileColor}]}>
                    <Image style={{ width: 36, height: 36 }}
                        onError={() => setPictureError(true)} 
                        source={(pictureError||!follow.picture) ? require("@assets/images/defaultProfile.png")
                            : { uri: follow?.picture }
                        } 
                    />
                </View>
            </View>
            <View style={{ width: "70%", padding: 5 }}>
                <View style={{ }}>
                    <Text style={styles.userName}>
                        {getUserName(follow, 24)}
                    </Text>
                    <TouchableOpacity 
                        activeOpacity={.7}
                        onPress={() => copyPubkey(follow.pubkey ?? "")}
                        style={{ flexDirection: "row" }}
                    >
                        <Text style={styles.pubkey}>
                            {getDisplayPubkey(follow.pubkey ?? "", 20)}
                        </Text>
                        <Ionicons name="copy" size={10} style={{ padding: 5 }} color={theme.colors.gray} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: { flexDirection: "row", width: "100%", padding: 2, backgroundColor: theme.colors.black },
    imageContainer: { width: 40, height: 40, borderWidth: 2, borderRadius: 50, overflow: "hidden" },
    userName: { fontSize: 18, fontWeight: "500", color: theme.colors.white },
    pubkey: { fontSize: 14, fontWeight: "400", color: theme.colors.gray },
})

export default ConversationHeader
