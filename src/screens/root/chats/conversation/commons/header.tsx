import { User } from "@/src/services/memory/types"
import theme from "@/src/theme"
import { copyPubkey, getDisplayPubkey, getUserName } from "@/src/utils"
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import { useState } from "react"

type Props = {
    follow: User
}

const ConversationHeader = ({ follow }: Props) => {

    const [pictureError, setPictureError] = useState(false)

    return (
        <View style={styles.headerContainer}>
            <View style={{ width: "16%", alignItems: "center", justifyContent: "center" }}>
                <View style={styles.imageContainer}>
                    {follow?.picture && <Image onError={() => setPictureError(true)} source={{ uri: follow?.picture }} style={{ flex: 1 }} />}
                    {(!follow?.picture || pictureError) && <Image source={require("@assets/images/defaultProfile.png")} style={{ width: 40, height: 40 }} />}                               
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
    imageContainer: { width: 40, height: 40, borderRadius: 50, overflow: "hidden" },
    userName: { fontSize: 18, fontWeight: "500", color: theme.colors.white },
    pubkey: { fontSize: 14, fontWeight: "400", color: theme.colors.gray },
})

export default ConversationHeader
