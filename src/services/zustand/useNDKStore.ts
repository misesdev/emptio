import NDK, { NDKPrivateKeySigner } from "@nostr-dev-kit/ndk-mobile"
import { PrivateKeyStorage } from "@storage/pairkeys/PrivateKeyStorage"
import { User } from "../user/types/User"
import { create } from "zustand"

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
        const service = new PrivateKeyStorage()
        const stored = await service.get(user.keyRef)
        set((state) => {
            state.ndk.signer = new NDKPrivateKeySigner(stored.entity)
            return state
        })
    }
}))

export default useNDKStore

