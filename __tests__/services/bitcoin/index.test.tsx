import { createWallet,  generateAddress, importWallet } from "@src/services/bitcoin";

describe("wallets bitcoin functions", () => {
    it("create wallet", () => {
        const { privateKey, publicKey } = createWallet("", "testnet").pairkey

        expect(privateKey).toBeDefined()
        expect(publicKey).toBeDefined()
    })
    it("generate wallet from mnemonic seed", async () => {
        const wallet = createWallet()

        const { pairkey } = await importWallet(wallet.mnemonic, "", "testnet")

        expect(wallet.pairkey.privateKey).toBe(pairkey.privateKey)
        expect(wallet.pairkey.publicKey).toBe(pairkey.publicKey)
    })

    it("generate address for transaction", () => {
        const { publicKey } = createWallet("", "testnet").pairkey

        const address = generateAddress(publicKey, "testnet")

        expect(address).toBeDefined()
    })
})
