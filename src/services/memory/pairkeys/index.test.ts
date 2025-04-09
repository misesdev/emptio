import EncryptedStorage from "react-native-encrypted-storage"
import { SecretStorage } from "./index"
import { ECPairKey } from "bitcoin-tx-lib"
import { Secret, PairKey } from "../types"

jest.mock("react-native-encrypted-storage", () => ({
    getItem: jest.fn(),
    setItem: jest.fn()
}))

jest.mock("bitcoin-tx-lib", () => ({
    ECPairKey: {
        fromHex: jest.fn()
    }
}))

describe("SecretStorage", () => {
    const exampleSecret: Secret = {
        key: "my-key",
        value: "my-private-key-hex"
    }

    const examplePairKey: PairKey = {
        key: "my-key",
        privateKey: "my-private-key-hex",
        publicKey: "compressed-public-key-hex"
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe("getSecret", () => {
        it("should return the correct secret if it exists", async () => {
            ;(EncryptedStorage.getItem as jest.Mock).mockResolvedValueOnce(
                JSON.stringify([exampleSecret])
            )

            const result = await SecretStorage.getSecret("my-key")

            expect(result).toEqual(exampleSecret)
        })

        it("should throw an error if the secret is not found", async () => {
            ;(EncryptedStorage.getItem as jest.Mock).mockResolvedValueOnce(
                JSON.stringify([])
            )

            await expect(SecretStorage.getSecret("nonexistent-key")).rejects.toThrow(
                "secret not found"
            )
        })
    })

    describe("addSecret", () => {
        it("should add a new secret and save it", async () => {
            const existingSecrets: Secret[] = []
            ;(EncryptedStorage.getItem as jest.Mock).mockResolvedValueOnce(
                JSON.stringify(existingSecrets)
            )

            await SecretStorage.addSecret(exampleSecret)

            expect(EncryptedStorage.setItem).toHaveBeenCalledWith(
                "secrets",
                JSON.stringify([exampleSecret])
            )
        })
    })

    describe("deleteSecret", () => {
        it("should delete a secret by key", async () => {
            const existingSecrets: Secret[] = [
                exampleSecret,
                { key: "another", value: "value" }
            ]
            ;(EncryptedStorage.getItem as jest.Mock).mockResolvedValueOnce(
                JSON.stringify(existingSecrets)
            )

            await SecretStorage.deleteSecret("my-key")

            expect(EncryptedStorage.setItem).toHaveBeenCalledWith(
                "secrets",
                JSON.stringify([{ key: "another", value: "value" }])
            )
        })
    })

    describe("getPairKey", () => {
        it("should return a valid PairKey from stored secret", async () => {
            ;(EncryptedStorage.getItem as jest.Mock).mockResolvedValueOnce(
                JSON.stringify([exampleSecret])
            )

            const mockEcPair = {
                privateKey: "my-private-key-hex",
                getPublicKeyCompressed: jest.fn().mockReturnValue("compressed-public-key-hex")
            }

            ;(ECPairKey.fromHex as jest.Mock).mockReturnValue(mockEcPair)

            const pairKey = await SecretStorage.getPairKey("my-key")

            expect(ECPairKey.fromHex).toHaveBeenCalledWith({ privateKey: exampleSecret.value })
            expect(pairKey).toEqual(examplePairKey)
        })
    })

    describe("addPairKey", () => {
        it("should store the private key from a PairKey", async () => {
            ;(EncryptedStorage.getItem as jest.Mock).mockResolvedValueOnce(
                JSON.stringify([])
            )

            await SecretStorage.addPairKey(examplePairKey)

            expect(EncryptedStorage.setItem).toHaveBeenCalledWith(
                "secrets",
                JSON.stringify([{
                    key: examplePairKey.key,
                    value: examplePairKey.privateKey
                }])
            )
        })
    })

    describe("deletePairKey", () => {
        it("should delete a secret with the matching key", async () => {
            const existingSecrets: Secret[] = [
                exampleSecret,
                { key: "other", value: "val" }
            ]
            ;(EncryptedStorage.getItem as jest.Mock).mockResolvedValueOnce(
                JSON.stringify(existingSecrets)
            )

            await SecretStorage.deletePairKey("my-key")

            expect(EncryptedStorage.setItem).toHaveBeenCalledWith(
                "secrets",
                JSON.stringify([{ key: "other", value: "val" }])
            )
        })
    })
})
