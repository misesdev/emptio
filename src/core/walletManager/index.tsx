import { generateAddress, createTransaction, createWallet, ValidateAddress, sendTransaction } from "@src/services/bitcoin"
import { getRandomKey } from "@src/services/bitcoin/signature"
import { deletePairKey, getPairKey, insertPairKey } from "@src/services/memory/pairkeys"
import { PairKey, Wallet } from "@src/services/memory/types"
import { deleteWallet, getWallet, insertWallet } from "@src/services/memory/wallets"
import { Response, trackException } from "@src/services/telemetry"

type Props = {
    name: string,
    type: "bitcoin" | "lightning"
}

const create = async ({ name, type }: Props): Promise<Response> => {
    try {
        const pairKey: PairKey = createWallet()

        const bitcoinAddress = generateAddress(pairKey.publicKey)

        const wallet: Wallet = {
            name: name,
            type: type,
            lastBalance: 0,
            lastReceived: 0,
            lastSended: 0,
            pairkey: pairKey.key,
            key: getRandomKey(10),
            address: bitcoinAddress
        }

        await insertPairKey(pairKey)

        await insertWallet(wallet)

        return { success: true, message: "success" }
    }
    catch (ex) { return trackException(ex) }
}

const exclude = async (wallet: Wallet): Promise<Response> => {

    try {
        await deletePairKey(wallet.pairkey ?? "")

        await deleteWallet(wallet.key ?? "")

        return { success: true, message: "" }
    }
    catch (ex) {
        return trackException(ex)
    }
}

const update = async () => {

}

type TransactionProps = { amount: number, destination: string, walletKey: string }

const transaction = {
    get: async ({ amount, destination, walletKey }: TransactionProps): Promise<Response> => {

        const wallet = await getWallet(walletKey)

        const pairkey = await getPairKey(wallet.pairkey ?? "")

        const transaction = await createTransaction({
            amount,
            destination,
            wallet,
            pairkey
        })

        return transaction
    },
    send: async (txHex: string): Promise<Response> => sendTransaction(txHex)
}

const address = {
    validate: (address: string) => ValidateAddress(address)
}


export const walletService = {
    create,
    update,
    exclude,
    address,
    transaction
}