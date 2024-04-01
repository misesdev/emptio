import { createPairKeys, derivatePublicKey, validatePrivateKey, getHexKeys } from "@src/services/nostr";
import { nip19 } from "nostr-tools";
import { hexToBytes } from "@noble/hashes/utils"

describe("Pair Keys Nostr", () => {
    it("generate pair keys => generated", () => {
        const { privateKey, publicKey } = createPairKeys()

        expect(privateKey).toBeDefined()
        expect(publicKey).toBeDefined()
    })
    it("derivate public key => generated", () => {
        const { privateKey, publicKey } = createPairKeys()

        const secretKey = derivatePublicKey(nip19.nsecEncode(hexToBytes(privateKey)))

        expect(publicKey).toBe(secretKey)
    })
    it("derivate public key => not generate", () => {

        const publicKey = derivatePublicKey("ngr8347hr384y3fhu3457y32i4uth34ty23498t2349")

        expect(publicKey).toBe("")
    })
    it("validate nostr privateKey => is valid", () => {
        const { privateKey } = createPairKeys()

        const valid = validatePrivateKey(nip19.nsecEncode(hexToBytes(privateKey)))

        expect(valid).toBe(true)
    })
    it("validate nostr privateKey => is invalid", () => {
        const privateKey = "bjdfkjd8tno8j4yo45459883k4085yu4oigho454g4t"

        const valid = validatePrivateKey(privateKey)

        expect(valid).toBe(false)
    })
    it("get hex keys => success", () => {
        const { privateKey } = createPairKeys()

        const pairKeyHex = getHexKeys(nip19.nsecEncode(hexToBytes(privateKey)))

        expect(pairKeyHex.privateKey).toHaveLength(64)
        expect(pairKeyHex.publicKey).toHaveLength(64)
    })
})


