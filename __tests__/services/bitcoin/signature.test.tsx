import { signHex, signBuffer } from "@/src/services/bitcoin/signature"


describe("signature test", () => {
    it("signBuffer deve gerar a assinatura esperada", () => {

        const privateKey = "1111111111111111111111111111111111111111111111111111111111111111"
        const txHex = Buffer.from("d3c72f8b2b8f1f7e9eebbd834f93f47b713acab6e58875cde4650b9c2c0c56f4", 'hex')
        const expectSig = "304402207a8197ca02292a564eeb800a6dc0b683d00f30cf6fbb8db6a04ad264e1edbb0202205cbe0f4b1fc31722d052d42fecf5f667f01ac18457c71d5f7feab6d30145d5b8"
        
        const signature = signBuffer(txHex, privateKey).toString('hex')

        expect(signature).toBe(expectSig)
    })
    it("signHex deve gerar a assinatura esperada", () => {
        const privateKey = "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
        const txHex = "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
        const expectSig = "30450221009e32a8ede3cce0913a08a892c2274006b7566c038a6adefcd0d516393623a45302206973aaeb3a18b8d18a81447dbc37917184fb53e30f2d0174d772099bbfc7de46"
        
        const signature = signHex(txHex, privateKey)

        expect(signature).toBe(expectSig)
    })
})