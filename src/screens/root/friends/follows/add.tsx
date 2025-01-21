import { SearchBox } from "@components/form/SearchBox"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { ActivityIndicator, View, Text } from "react-native"
import { User } from "@src/services/memory/types"
import { useAuth } from "@src/providers/userProvider"
import { useTranslateService } from "@/src/providers/translateProvider"
import { userService } from "@/src/core/userManager"
import { UserList } from "@/src/components/nostr/user/UserList"
import theme from "@src/theme"
import { useState } from "react"
import FollowModal, { showFollowModal } from "@/src/components/nostr/follow/FollowModal"
import { NostrEvent } from "@nostr-dev-kit/ndk"

const AddFolowScreen = ({ navigation }: any) => {

    const { user, followsEvent, setFollowsEvent } = useAuth()
    const { useTranslate } = useTranslateService()
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(false)
   
    const handleSearch = async (searchTerm: string) => {

        if(searchTerm?.length <= 1) return setUsers([])
            
        setLoading(true)

        //const users = await 
        userService.searchUsers(user, searchTerm, 30).then(users => {
            users.sort((a, b) => (b.similarity ?? 1) - (a.similarity ?? 1))

            const friends = followsEvent?.tags?.filter(t => t[0] == "p").map(t => t[1]) ?? []
            
            users.forEach(user => {
                user.friend = friends.includes(user.pubkey ?? "")
            })

            setUsers(users)

            setLoading(false)
        })
        .catch(() => setLoading(false))
    }

    const AddUserOnFollowList = async (friend: User) => {

        setUsers(users.map((user: User) => {
            if(user.pubkey == friend.pubkey) user.friend = !user.friend
            return user
        }))

        if(friend.friend) 
        {   
            console.log("add friend")
            followsEvent?.tags?.push(["p", friend.pubkey ?? ""])

            if(setFollowsEvent) setFollowsEvent(followsEvent as NostrEvent)

            setTimeout(async () => await userService.addFollow({
                user,
                friend,
                followsEvent: followsEvent as NostrEvent
            }), 50)
        } 
        else {
            followsEvent!.tags = followsEvent!.tags.filter(t => t[0] == "p" && t[1] != friend.pubkey)
            
            await userService.removeFollow({
                user,
                friend,
                followsEvent: followsEvent as NostrEvent
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

            <UserList toFollow users={users} setUsers={setUsers} onPressUser={handleAddFollow} />

            <View style={{ height: 38 }}></View>

            <FollowModal handleAddFollow={AddUserOnFollowList} />
        </View>
    )
}

export default AddFolowScreen



