import { getUtxos } from "@/src/services/bitcoin/mempool"
import { useTranslate } from "@/src/services/translate"
import { Tx } from "@mempool/mempool.js/lib/interfaces/bitcoin/transactions"
import { generateAddress, createTransaction, createWallet, ValidateAddress, sendTransaction } from "@src/services/bitcoin"
import { getRandomKey } from "@src/services/bitcoin/signature"
import { deletePairKey, getPairKey, insertPairKey } from "@src/services/memory/pairkeys"
import { PairKey, Transaction, Wallet, WalletInfo } from "@src/services/memory/types"
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

const update = async (wallet: Wallet) => {

}

const listTransactions = async (address: string): Promise<WalletInfo> => {
    const response: WalletInfo = { balance: 0, sended: 0, received: 0, transactions: [] }

    const utxos: Tx[] = await getUtxos(address)

    utxos.forEach(utxo => {
        let received = utxo.vout.reduce((acumulator, tx) => {
            if (tx.scriptpubkey_address == address)
                return acumulator + tx.value
            else
                return acumulator
        }, 0)

        let sended = utxo.vin.reduce((acumulator, tx) => {
            if (tx.prevout.scriptpubkey_address == address)
                return acumulator + tx.prevout.value
            else
                return acumulator
        }, 0)

        const transaction: Transaction = {
            txid: utxo.txid,
            confirmed: utxo.status.confirmed,
            description: utxo.status.confirmed ? useTranslate("message.transaction.confirmed") : useTranslate("message.transaction.notconfirmed"),
            type: received > sended ? "received" : "sended",
            amount: received > sended ? received : sended,
            date: utxo.status.confirmed ? new Date(utxo.status.block_time * 1000).toLocaleString() : useTranslate("message.transaction.notconfirmed")
        }

        response.transactions.push(transaction)
        response.received += received
        response.sended += sended
    })

    response.balance = response.received - response.sended

    return response
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
    delete: exclude,
    listTransactions,
    address,
    transaction
}