import { SearchBox } from "@components/form/SearchBox"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { ActivityIndicator, View, Text } from "react-native"
import { User } from "@src/services/memory/types"
import { useAuth } from "@src/providers/userProvider"
import { useTranslateService } from "@/src/providers/translateProvider"
import { userService } from "@/src/core/userManager"
import { UserList } from "@/src/components/nostr/user/UserList"
import theme from "@src/theme"
import { useEffect, useState } from "react"
import FollowModal, { showFollowModal } from "@/src/components/nostr/follow/FollowModal"
import { NostrEvent } from "@nostr-dev-kit/ndk"
import { Ionicons } from "@expo/vector-icons"

const AddFolowScreen = ({ navigation }: any) => {

    const { user, followsEvent, setFollowsEvent } = useAuth()
    const { useTranslate } = useTranslateService()
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(false)
    const [reloadUsers, setReloadUsers] = useState(true)

    const handleSearch = async (searchTerm: string) => {

        if(searchTerm?.length <= 1) return setUsers([])
            
        setLoading(true)

        const users = await userService.searchUsers(user, searchTerm)

        users.sort((a, b) => (b.similarity ?? 1) - (a.similarity ?? 1))

        setUsers(users)

        setReloadUsers(!reloadUsers)

        setLoading(false)
    }

    const AddUserOnFollowList = async (friend: User, action: string) => {

        if(action == "add") 
        {
            followsEvent!.tags.push(["p", friend.pubkey ?? ""])
            setReloadUsers(!reloadUsers)
            await userService.addFollow({
                user,
                friend,
                followsEvent: followsEvent as NostrEvent,
                setFollowsEvent: setFollowsEvent,
            })
        }
        if(action == "remove") 
        {
            followsEvent!.tags = followsEvent!.tags.filter(t => t[0] == "p" && t[1] != friend.pubkey)
            setReloadUsers(!reloadUsers)
            await userService.removeFollow({
                user,
                friend,
                followsEvent: followsEvent as NostrEvent,
                setFollowsEvent: setFollowsEvent,
            })
        }
    }

    const handleAddFollow = async (follow: User) => {
        showFollowModal({ user: follow })
    }

    return (
        <View style={theme.styles.container}>

            <HeaderScreen title={useTranslate("screen.title.addfriend")} onClose={() => navigation.navigate("core-stack")} />

            <SearchBox label={useTranslate("commons.search")} onSearch={handleSearch} />

            {loading && <ActivityIndicator color={theme.colors.gray} size={50} />}

            {!users.length && !loading &&
                <View style={{ width: "100%", alignItems: "center", paddingHorizontal: 42, marginTop: 120 }}>
                    {/* <Ionicons name="search" color={theme.colors.gray} size={120}/> */}
                    <Text style={{ color: theme.colors.gray, fontSize: 16, fontWeight: "400", textAlign: "center", marginVertical: 20 }}>
                        {useTranslate("friends.search.subtitle")}
                    </Text>
                </View>
            } 

            <UserList reload={reloadUsers} toFollow users={users} setUsers={setUsers} onPressUser={handleAddFollow} />

            <View style={{ height: 38 }}></View>

            <FollowModal handleAddFollow={AddUserOnFollowList} />
        </View>
    )
}

export default AddFolowScreen



