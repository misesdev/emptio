import { SearchBox } from "@components/form/SearchBox"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { ActivityIndicator, View } from "react-native"
import { User } from "@src/services/memory/types"
import { useAuth } from "@src/providers/userProvider"
import { useTranslateService } from "@/src/providers/translateProvider"
import { userService } from "@/src/core/userManager"
import { UserList } from "@/src/components/nostr/user/UserList"
import theme from "@src/theme"
import { useEffect, useState } from "react"
import FollowModal, { showFollowModal } from "@/src/components/nostr/follow/FollowModal"
import { NostrEvent } from "@nostr-dev-kit/ndk"


const AddFolowScreen = ({ navigation }: any) => {

    const { user, followsEvent, setFollowsEvent } = useAuth()
    const { useTranslate } = useTranslateService()
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(false)
    //const [friends, setFriends] = useState<User[]>([])

    // useEffect(() => { loadFriends() }, [])

    // const loadFriends = async () => {
    //     const follows = await userService.listFollows(user)

    //     setFriends(follows)
    // }

    const handleSearch = async (searchTerm: string) => {

        if(searchTerm?.length <= 1) return setUsers([])
            
        setLoading(true)

        const users = await userService.searchUsers(user, searchTerm)

        users.sort((a, b) => (b.similarity ?? 1) - (a.similarity ?? 1))

        setUsers(users)

        setLoading(false)
    }

    const AddUserOnFollowList = async (friend: User) => {
        await userService.addFollow({
            user,
            friend,
            followsEvent: followsEvent as NostrEvent,
            setFollowsEvent: setFollowsEvent,
        })
    }

    const handleAddFollow = async (follow: User) => {
        showFollowModal({ user: follow })
    }

    return (
        <View style={theme.styles.container}>

            <HeaderScreen title={useTranslate("screen.title.addfriend")} onClose={() => navigation.navigate("core-stack")} />

            <SearchBox label={useTranslate("commons.search")} onSearch={handleSearch} />

            {loading && <ActivityIndicator color={theme.colors.gray} size={50} />}

            <UserList users={users} onPressUser={handleAddFollow} />

            <View style={{ height: 38 }}></View>

            <FollowModal handleAddFollow={AddUserOnFollowList} />
        </View>
    )
}

export default AddFolowScreen



