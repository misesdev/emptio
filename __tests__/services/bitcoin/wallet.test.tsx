import { walletService } from "@/src/core/walletManager";
import { createWallet, getSeedPhrase } from "@/src/services/bitcoin";

describe("bitcoin wallet", () => {
    it("import wallet from seedphrase with passphrase", () => {

        const { privateKey } = createWallet()

        const seedphrase = getSeedPhrase(privateKey)

    })
})