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
        const privateKey = await service.get(user.keychanges)
        set((state) => {
            state.ndk.signer = new NDKPrivateKeySigner(privateKey)
            return state
        })
    }
}))

export default useNDKStore

