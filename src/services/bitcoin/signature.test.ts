import { getRandomKey } from "./signature"

describe("signature test", () => {
    test("generate random key", () => {
        try {
            let key = getRandomKey(20)
            expect(key.length).toBe(20)

            for(let i = 0; i <= 10000; i++) {
                let pkey = getRandomKey(20)
                if(pkey == key) throw new Error("insecure key handle")
            }
        } catch {
            expect(true).toBe(false)
        }
    })
})
