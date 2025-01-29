import { createWallet, importWallet } from "@/src/services/bitcoin";

describe("bitcoin wallet", () => {
    it("import wallet from seedphrase with passphrase", async () => {

        const wallet = createWallet("", "testnet")

        const { pairkey } = await importWallet(wallet.mnemonic, "", "testnet")

        expect(wallet.pairkey.privateKey).toBe(pairkey.privateKey)
    })
})
