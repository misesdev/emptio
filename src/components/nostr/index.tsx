import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View, Text, Image } from "react-native"
import { useAuth } from "@src/providers/userProvider"
import { User } from "@src/services/memory/types"
import { useEffect, useState } from "react"
import theme from "@/src/theme"

type FriendListProps = {
    searchTerm: string,
    onPressFollow: (user: User) => void
}

export const FriendList = ({ searchTerm, onPressFollow }: FriendListProps) => {

    const { user } = useAuth()
    const [refreshing, setRefreshing] = useState(true)
    const [followList, setFollowList] = useState<User[]>([])

    useEffect(() => {
        handleListFollows()
    }, [searchTerm])

    const handleListFollows = async () => {

        setRefreshing(true)

        setFollowList([
            { name: "Marcos Vale", about: "Estou seguindo John Gault" },
            { name: "Felipe Neves", about: "Don't trust, verify!" },
            { name: "Lucas Botelho Neto", about: "desenvolvedor back end libertário" },
            { name: "Marcos Vale", about: "Estou seguindo John Gault" },
            { name: "Felipe Neves", about: "Don't trust, verify!" },
            { name: "Lucas Botelho Neto", about: "desenvolvedor back end libertário" },
            { name: "Marcos Vale", about: "Estou seguindo John Gault" },
            { name: "Felipe Neves", about: "Don't trust, verify!" },
            { name: "Marcos Botelho Neto", about: "desenvolvedor back end libertário" }
        ])

        setTimeout(() => setRefreshing(false), 1000)
    }

    return (
        <ScrollView
            contentContainerStyle={theme.styles.scroll_container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleListFollows} />}
        >
            {followList &&
                followList.map((follow, key) => {
                    return (
                        <TouchableOpacity style={styles.sectionTransaction} onPress={() => onPressFollow(follow)} key={key} activeOpacity={.7}>
                            {/* Transaction Type */}
                            <View style={{ width: "20%", minHeight: 75, justifyContent: "center", alignItems: "center" }}>
                                {follow.picture && <Image source={{ uri: follow.picture }} style={styles.profile} />}
                                {!follow.picture && <Image source={require("assets/images/defaultProfile.png")} style={styles.profile} />}
                            </View>
                            {/* Transaction Description and Date */}
                            <View style={{ width: "80%", minHeight: 75 }}>
                                <View style={{ width: "100%" }}>
                                    <Text style={{ color: theme.colors.white, fontFamily: "", fontSize: 14, fontWeight: "600", margin: 2, marginTop: 12 }}>
                                        {follow.name}
                                    </Text>
                                </View>
                                <View style={{ width: "100%" }}>
                                    <Text style={{ fontSize: 12, color: theme.colors.gray, margin: 2, fontWeight: "bold" }}>
                                        {follow.about}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )
                })
            }
            <View style={{ height: 75 }}></View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    profile: {
        width: 50,
        height: 50,
        borderRadius: 50
    },
    sectionTransaction: {
        width: "96%",
        minHeight: 75,
        maxHeight: 120,
        borderRadius: 23,
        marginVertical: 4,
        flexDirection: "row",
        backgroundColor: "rgba(0, 55, 55, .2)"
    }
})