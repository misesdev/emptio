import { createPairKeys, getPublicKey } from "@/src/services/nostr/core";

describe("Pair Keys Nostr", () => {
    it("generate pair keys", () => {
        const { privateKey, publicKey } = createPairKeys()

        expect(privateKey).toBeDefined()
        expect(publicKey).toBeDefined()
    })
    it("derivate public key", () => {
        const { privateKey, publicKey } = createPairKeys()
        const derivatePublicKey = getPublicKey(privateKey)

        expect(publicKey).toBe(derivatePublicKey)
    })
})