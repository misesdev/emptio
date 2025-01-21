import { getTransactionInfo, getUtxo, getUtxos } from "@/src/services/bitcoin/mempool"
import { getUser } from "@/src/services/memory/user"
import { useTranslate } from "@/src/services/translate"
import { Tx } from "@mempool/mempool.js/lib/interfaces/bitcoin/transactions"
import { generateAddress, createTransaction, createWallet, ValidateAddress, sendTransaction, importWallet, getSeedPhrase, BaseWallet } from "@src/services/bitcoin"
import { getRandomKey } from "@src/services/bitcoin/signature"
import { deletePairKey, getPairKey, insertPairKey } from "@src/services/memory/pairkeys"
import { PairKey, Transaction, TransactionInput, TransactionOutput, Wallet, WalletInfo, WalletType } from "@src/services/memory/types"
import { clearDefaultWallets, deleteWallet, getWallet, getWallets, insertWallet, updateWallet } from "@src/services/memory/wallets"
import { Response, trackException } from "@src/services/telemetry"
import { userService } from "../userManager"
import { Network } from "../../services/bitcoin/types"

type Props = {
    name: string,
    type: WalletType,
    password: string,
    wallets: Wallet[]
}

const create = async ({ name, type, password, wallets }: Props): Promise<Response<BaseWallet>> => {
    try {
        const network: Network = type == "bitcoin" ? "mainnet" : "testnet"

        const walletData: BaseWallet = createWallet(password, network)
        
        const bitcoinAddress = generateAddress(walletData.pairkey.publicKey, network)

        const wallet: Wallet = {
            name: name,
            type: type,
            lastBalance: 0,
            lastReceived: 0,
            lastSended: 0,
            pairkey: walletData.pairkey.key,
            key: getRandomKey(10),
            address: bitcoinAddress,
            default: wallets.length <= 0
        }

        walletData.wallet = wallet

        await insertPairKey(walletData.pairkey)

        await insertWallet(wallet)

        return { success: true, message: "success", data: walletData }
    }
    catch (ex) { return trackException(ex) }
}

type ImportProps = {
    name: string,
    mnemonic: string,
    password?: string,
    type?: WalletType
}

const require = async ({ name, type = "bitcoin", mnemonic, password }: ImportProps): Promise<Response<BaseWallet>> => {

    try {
        const network: Network = type == "bitcoin" ? "mainnet" : "testnet"

        const base = await importWallet(mnemonic, password, network)
        
        const bitcoinAddress = generateAddress(base.pairkey.publicKey, network)

        const wallet: Wallet = {
            name: name,
            type: type,
            lastBalance: 0,
            lastReceived: 0,
            lastSended: 0,
            pairkey: base.pairkey.key,
            key: getRandomKey(10),
            address: bitcoinAddress
        }

        base.wallet = wallet

        await insertPairKey(base.pairkey)

        await insertWallet(wallet)

        return { success: true, message: "", data: base }
    }
    catch (ex) {
        return trackException(ex)
    }
}

const seedphrase = async (pairkey: string): Promise<Response<string>> => {

    try 
    {
        const pairKey = await getPairKey(pairkey)

        const seedphrase = getSeedPhrase(pairKey.privateKey)

        return { success: true, message: "", data: seedphrase }
    } catch (ex) {
        return trackException(ex)
    }
}

const exclude = async (wallet: Wallet): Promise<Response<any>> => {

    try {
        await deletePairKey(wallet.pairkey ?? "")

        await deleteWallet(wallet.key ?? "")

        if(wallet.default) 
        {
            const wallets = await list()
            if(wallets.length) 
            {
                wallets[0].default = true
                await update(wallets[0])

                const user = await getUser()

                user.default_wallet = wallets[0].key
                user.bitcoin_address = wallets[0].address

                userService.updateProfile({ user, upNostr: true })
            }
        }

        return { success: true, message: "" }
    }
    catch (ex) {
        return trackException(ex)
    }
}

const update = async (wallet: Wallet) => {
    
    if(wallet.default) await clearDefaults()

    await updateWallet(wallet)
}

const listTransactions = async (address: string, network: Network): Promise<WalletInfo> => {
    const response: WalletInfo = { balance: 0, sended: 0, received: 0, transactions: [] }

    const utxos: Tx[] = await getUtxos(address, network)

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
            fee: utxo.fee,
            confirmed: utxo.status.confirmed,
            description: utxo.status.confirmed ? useTranslate("message.transaction.confirmed") : useTranslate("message.transaction.notconfirmed"),
            type: received > sended ? "received" : "sended",
            amount: received > sended ? received : sended,
            date: utxo.status.confirmed ? new Date(utxo.status.block_time * 1000).toLocaleString() : useTranslate("message.transaction.notconfirmed"),
            timestamp: utxo.status.confirmed ? utxo.status.block_time : Date.now()
        }

        response.transactions.push(transaction)
        response.received += received
        response.sended += sended
    })

    response.balance = response.received - response.sended
    response.transactions.sort((a, b) => (b.timestamp ?? 1) - (a.timestamp ?? 1));

    return response
}

type TransactionProps = { amount: number, destination: string, walletKey: string }

const transaction = {
    get: async ({ amount, destination, walletKey }: TransactionProps): Promise<Response<any>> => {

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
    send: async (txHex: string, network: Network): Promise<Response<any>> => sendTransaction(txHex, network),
    details: async (txid: string, network: Network) => await getTransactionInfo(txid, network)
}

const address = {
    validate: (address: string) => ValidateAddress(address)
}

const clearDefaults = async () => {
    await clearDefaultWallets()
}

const list = async (): Promise<Wallet[]> => await getWallets()

export const walletService = {
    create,
    update,
    import: require,
    delete: exclude,
    clearDefaults,
    seed: seedphrase,
    listTransactions,
    list,
    address,
    transaction
}
