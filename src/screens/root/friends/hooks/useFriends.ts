import { useAccount } from "@src/context/AccountContext"
import { useService } from "@src/providers/ServiceProvider"
import { User } from "@services/user/types/User"
import { Utilities } from "@src/utils/Utilities"
import { Address } from "bitcoin-tx-lib"
import { useState } from "react"

export const useFriends = () => {

    const { userService } = useService()
    const { follows, setFollows, followsEvent } = useAccount()
    const [friends, setFriends] = useState<User[]>(follows)
  
    const search = (filter: string) => {
        if (filter?.length && !Address.isValid(filter)) {
            const searchResult = follows?.filter(follow => {
                let filterNameLower = Utilities.getUserName(follow, 30).toLowerCase()
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
    
        await userService.updateFollows(followsEvent)
    }

    return {
        friends,
        search,
        remove
    }
}
