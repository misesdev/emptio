import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import { ProfilePicture } from "@components/nostr/user/ProfilePicture"
import { User } from "@services/user/types/User"
import { Utilities } from "@src/utils/Utilities"
import theme from "@/src/theme"

type Props = {
    follow: User;
}

const ConversationHeader = ({ follow }: Props) => {

    return (
        <View style={styles.headerContainer}>
            <View style={{ width: "16%", alignItems: "center", justifyContent: "center" }}>
                <ProfilePicture user={follow} size={40} />
            </View>
            <View style={{ width: "70%", padding: 5 }}>
                <View style={{ }}>
                    <Text style={styles.userName}>
                        {Utilities.getUserName(follow, 24)}
                    </Text>
                    <TouchableOpacity 
                        activeOpacity={.7}
                        onPress={() => Utilities.copyPubkey(follow.pubkey ?? "")}
                        style={{ flexDirection: "row" }}
                    >
                        <Text style={styles.pubkey}>
                            {Utilities.getDisplayPubkey(follow.pubkey ?? "", 20)}
                        </Text>
                        <Ionicons name="copy" size={10} style={{ padding: 5 }} color={theme.colors.gray} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: { flexDirection: "row", width: "100%", padding: 2,
        backgroundColor: theme.colors.semitransparent },
    imageContainer: { width: 40, height: 40, borderWidth: 2, borderRadius: 50, 
        overflow: "hidden" },
    userName: { fontSize: 18, fontWeight: "500", color: theme.colors.white },
    pubkey: { fontSize: 14, fontWeight: "400", color: theme.colors.gray },
})

export default ConversationHeader
