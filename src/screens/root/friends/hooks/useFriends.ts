import { useAuth } from "@src/providers/userProvider"
import { User } from "@services/memory/types"
import { userService } from "@services/user"
import { walletService } from "@services/wallet"
import { getUserName } from "@src/utils"
import { useState } from "react"

export const useFriends = () => {

    const { user, follows, setFollows, followsEvent } = useAuth()
    const [friends, setFriends] = useState<User[]>(follows)
  
    const search = (filter: string) => {
        if (filter?.length && !walletService.address.validate(filter)) {
            const searchResult = follows?.filter(follow => {
                let filterNameLower = getUserName(follow, 30).toLowerCase()
                return filterNameLower.includes(filter.toLowerCase())
            })

            setFriends(searchResult ?? [])
        }
        else setFriends(follows??[])
    }

    const remove = async (follow: User) => {
      
        setFriends(prev => {
            return [...prev.filter(f => f.pubkey != follow.pubkey)]
        })

        if(setFollows && follows) 
            setFollows([...follows.filter(f => f.pubkey != follow.pubkey)])

        followsEvent!.tags = followsEvent?.tags?.filter(t => t[0] == "p" && t[1] != follow.pubkey) ?? []
    
        await userService.updateFollows({ user, follows: followsEvent })
    }

    return {
        friends,
        search,
        remove
    }
}
