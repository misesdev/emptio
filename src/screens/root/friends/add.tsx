import { SearchBox } from "@components/form/SearchBox"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { User } from "@services/memory/types"
import { useAuth } from "@src/providers/userProvider"
import { useTranslateService } from "@src/providers/translateProvider"
import { userService } from "@src/core/userManager"
import { UserList } from "@components/nostr/user/UserList"
import FollowModal, { showFollowModal } from "@components/nostr/follow/FollowModal"
import { StackScreenProps } from "@react-navigation/stack"
import { View } from "react-native"
import { useState } from "react"
import theme from "@src/theme"

const AddFolowScreen = ({ navigation }: StackScreenProps<any>) => {

    const { user, follows, setFollows, followsEvent } = useAuth()
    const { useTranslate } = useTranslateService()
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(false)
   
    const handleSearch = async (searchTerm: string) => {

        if(searchTerm?.length <= 1) return setUsers([])
            
        setLoading(true)
        try {
            const users = await userService.searchUsers(user, searchTerm, 100)

            const friends = followsEvent?.tags?.filter(t => t[0] == "p").map(t => t[1]) ?? []
            
            users.forEach(user => {
                user.friend = friends.includes(user.pubkey ?? "")
            })

            setUsers(users)        
        } catch(ex) { 
            console.log(ex) 
        }
        setLoading(false)
    }

    const AddUserOnFollowList = async (friend: User) => {

        setUsers(users.map((user: User) => {
            if(user.pubkey == friend.pubkey) user.friend = !user.friend
            return user
        }))

        if(friend.friend) {    
            followsEvent?.tags?.push(["p", friend.pubkey ?? ""])
            if(setFollows && follows) setFollows([friend,...follows])
        } else {
            followsEvent!.tags = followsEvent?.tags?.filter(t => t[0] == "p" && t[1] != friend.pubkey) ?? []
            if(setFollows && follows) 
                setFollows([...follows.filter(f => f.pubkey != friend.pubkey)])
        }

        // if(setFollowsEvent && followsEvent) setFollowsEvent(followsEvent)

        await userService.updateFollows({ user, follows: followsEvent })
    }

    const handleAddFollow = async (follow: User) => {
        showFollowModal({ user: follow })
    }

    return (
        <View style={theme.styles.container}>

            <HeaderScreen 
                title={useTranslate("screen.title.addfriend")} 
                onClose={() => navigation.goBack()} 
            />

            <SearchBox 
                seachOnLenth={1} delayTime={300}
                label={useTranslate("commons.search")} 
                onSearch={handleSearch} 
            />

            <UserList toView
                refreshing={loading} users={users} 
                setUsers={setUsers} onPressUser={handleAddFollow}
            />

            <View style={{ height: 38 }}></View>

            <FollowModal handleAddFollow={AddUserOnFollowList} />
        </View>
    )
}

export default AddFolowScreen



