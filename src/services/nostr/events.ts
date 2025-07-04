import { NDKUserProfile } from "@nostr-dev-kit/ndk-mobile"
import { PairKey } from "@services/memory/types"
import useNDKStore from "@services/zustand/ndk"

export const publishUser = async (profile: NDKUserProfile, keys: PairKey) => {

    const ndk = useNDKStore.getState().ndk

    const user = ndk.getUser({ hexpubkey: keys.publicKey })

    await user.fetchProfile()

    user.profile = profile

    await user.publish()
}


