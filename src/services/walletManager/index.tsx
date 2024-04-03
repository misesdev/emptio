import { getBitcoinAddress, createWallet } from "../bitcoin"
import { getRandomKey } from "../bitcoin/signature"
import { deletePairKey, insertPairKey } from "../memory/pairkeys"
import { PairKey, Wallet } from "../memory/types"
import { deleteWallet, insertWallet } from "../memory/wallets"
import { Response, trackException } from "../telemetry/telemetry"

type Props = {
    name: string,
    type: "bitcoin" | "lightning"
}

const create = async ({ name, type }: Props): Promise<Response> => {
    try {
        const pairKey: PairKey = createWallet()

        const bitcoinAddress = getBitcoinAddress(pairKey.publicKey)

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

export const walletService = {
    create,
    update,
    exclude
}