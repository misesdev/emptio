import { createWallet, getSeedPhrase, seedToWallet, generateAddress } from "@src/services/bitcoin";

describe("wallets bitcoin functions", () => {
    it("create wallet", () => {
        const { privateKey, publicKey } = createWallet()

        expect(privateKey).toBeDefined()
        expect(publicKey).toBeDefined()
    })
    it("get seed from private key", () => {
        const { privateKey } = createWallet()

        const seed = getSeedPhrase(privateKey)

        expect(seed).toBeDefined()

        let words = seed.split(" ")

        expect(words.length).toBe(24)
    })
    it("generate wallet from mnemonic seed", () => {
        const { privateKey, publicKey } = createWallet()

        const seed = getSeedPhrase(privateKey)

        const wallet = seedToWallet(seed)

        expect(wallet.privateKey).toBe(privateKey)
        expect(wallet.publicKey).toBe(publicKey)
    })
    it("generate address for transaction", () => {
        const { publicKey } = createWallet()

        const address = generateAddress(publicKey)

        expect(address).toBeDefined()
        // expect(address.substring(0,1)).toBe("1")
    })
})