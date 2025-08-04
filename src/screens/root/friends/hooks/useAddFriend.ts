import { useAccount } from "@src/context/AccountContext"
import { User } from "@services/user/types/User"
import { useState } from "react"
import { useService } from "@/src/providers/ServiceProvider"

export const useAddFriend = () => {
   
    const { userService } = useService()
    const { follows, setFollows, followsEvent } = useAccount()
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(false)
   
    const search = async (searchTerm: string) => {

        if(searchTerm?.length <= 1) return setUsers([])
            
        setLoading(true)
        try {
            const users = await userService.searchUser({ searchTerm, limit: 100 })

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

    const addUser = async (friend: User) => {

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

        await userService.updateFollows(followsEvent)
    }

    return {
        users,
        loading,
        search,
        addUser
    }
}
