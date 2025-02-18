import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native"
import { useTranslateService } from "@src/providers/translateProvider"
import { StackNavigationProp } from "@react-navigation/stack"
import { useAuth } from "@/src/providers/userProvider"
import Ionicons from "react-native-vector-icons/Ionicons"
import theme from "@/src/theme"
import { ProfilePicture } from "@/src/components/nostr/user/ProfilePicture"

type ScreenProps = { 
    navigation: StackNavigationProp<any> 
}
export const HeaderChats = ({ navigation }: ScreenProps) => {

    const { user } = useAuth()
    const { useTranslate } = useTranslateService()

    return (
        <View style={styles.header}>
            <View style={{ width: "15%", alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity onPress={() => navigation.navigate("user-menu-stack")}>
                    <ProfilePicture user={user} size={38} withBorder={false} />
                </TouchableOpacity>
            </View>

            <View style={{ width: "70%", padding: 6 }}>
                <Text style={styles.title}>
                    {useTranslate("chats.title")}
                </Text>
            </View>
            <View style={{ width: "15%", alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity onPress={() => navigation.navigate("add-follow-stack")}>
                    <Ionicons name="person-add-sharp" color={theme.colors.gray} size={theme.icons.large} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        width: "100%",
        flexDirection: "row",
        paddingVertical: 5,
        backgroundColor: theme.colors.black
    },
    title: { color: theme.colors.white, fontSize: 20, fontWeight: "bold", marginLeft: 15 },
})
