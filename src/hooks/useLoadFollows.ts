import { useEffect, useMemo, useState } from "react"
import { User } from "@services/user/types/User"
import UserService from "@services/user/UserService"
import { NDKEvent } from "@nostr-dev-kit/ndk-mobile"

const useLoadFollows = (user: User) => {

    const userService = useMemo(() => new UserService(user), [])
    const [follows, setFollows] = useState<User[]>([])
    const [followsEvent, setFollowsEvent] = useState<NDKEvent>({} as NDKEvent)
    const [loading, setLoading] = useState(true)

    useEffect(() => { 
        if(!followsEvent.pubkey) return;
        const load = async () => await loadFollows()
        load()
    }, [followsEvent])

    const loadFollows = async () => {
        // const followsEvent = await userService.getFollowsEvent()
        // if(followsEvent)
        //     setFollowsEvent(followsEvent)
        const follows = await userService.listFollows({ follows: followsEvent })
        if(follows)
            setFollows(follows)
        setLoading(false)
    }

    return {
        follows,
        setFollows,
        followsEvent,
        setFollowsEvent,
        loading
    }
}

export default useLoadFollows

