import { createWallet, getSeedPhrase, importWallet } from "@/src/services/bitcoin";

describe("bitcoin wallet", () => {
    it("import wallet from seedphrase with passphrase", async () => {

        const { privateKey } = createWallet()

        const seedphrase = getSeedPhrase(privateKey)

        const wallet = await importWallet(seedphrase)

        expect(privateKey).toBe(wallet.privateKey)
    })
})