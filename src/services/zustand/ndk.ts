import NDK, { NDKPrivateKeySigner } from "@nostr-dev-kit/ndk-mobile"
import { create } from "zustand"
import { User } from "../memory/types"
import { storageService } from "../memory"

interface NDKStore {
    ndk: NDK,
    setNDK: (ndk: NDK) => void
    setNdkSigner: (user: User) => Promise<void>
}

const useNDKStore = create<NDKStore>((set) => ({
    ndk: new NDK(),
    setNDK: (ndk: NDK) => {
        set(()  => ({
            ndk: ndk
        }))
    },
    setNdkSigner: async (user: User) => {
        const pairKey = await storageService.secrets.getPairKey(user.keychanges ?? "")
        set((state) => {
            state.ndk.signer = new NDKPrivateKeySigner(pairKey.privateKey)
            return state
        })
    }
}))

export default useNDKStore

