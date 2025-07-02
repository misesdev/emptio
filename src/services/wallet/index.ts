import { getTransactionInfo, getTxs, getUtxos } from "@services/bitcoin/mempool"
import { useTranslate } from "@services/translate"
import { Tx } from "@mempool/mempool.js/lib/interfaces/bitcoin/transactions"
import { createTransaction, createWallet, ValidateAddress, 
    sendTransaction, importWallet, BaseWallet } from "@services/bitcoin"
import { getRandomKey } from "@services/bitcoin/signature"
import { Transaction, Wallet, WalletInfo } from "@services/memory/types"
import { AddressTxsUtxo } from "@mempool/mempool.js/lib/interfaces/bitcoin/addresses"
import { Response, trackException } from "@services/telemetry"
import { timeSeconds } from "@services/converter"
import { storageService } from "@services/memory"
import { userService } from "../user"
import { Address, BNetwork } from "bitcoin-tx-lib"

interface CreateProps {
    name: string,
    network: BNetwork,
    password: string
}

const create = async ({ name, network, password }: CreateProps): Promise<Response<BaseWallet>> => {
    try {
        const wallets = await storageService.wallets.list() 

        const base: BaseWallet = createWallet(password, network)
        
        const address = Address.fromPubkey({
            pubkey: base.pairkey.publicKey, network
        })

        base.wallet = {
            name,
            lastBalance: 0,
            lastReceived: 0,
            lastSended: 0,
            pairkey: base.pairkey.key,
            default: !wallets.length,
            key: getRandomKey(15),
            payfee: false,
            address,
            network
        }

        await storageService.secrets.addPairKey(base.pairkey)

        await storageService.wallets.add(base.wallet)

        return { success: true, message: "success", data: base }
    }
    catch (ex) { return trackException(ex) }
}

interface ImportProps {
    name: string,
    mnemonic: string,
    password?: string,
    network?: BNetwork
}

const require = async ({ name, network = "mainnet", mnemonic, password }: ImportProps): Promise<Response<BaseWallet>> => {

    try {
        const wallets = await storageService.wallets.list()

        const base = await importWallet(mnemonic, password, network)
        
        const address = Address.fromPubkey({ 
            pubkey: base.pairkey.publicKey, network
        })

        base.wallet = {
            name,
            lastBalance: 0,
            lastReceived: 0,
            lastSended: 0,
            default: !wallets.length,
            pairkey: base.pairkey.key,
            key: getRandomKey(15),
            payfee: false,
            address,
            network,
        }

        await storageService.secrets.addPairKey(base.pairkey)

        await storageService.wallets.add(base.wallet)

        return { success: true, message: "", data: base }
    }
    catch (ex) {
        return trackException(ex)
    }
}

const exclude = async (wallet: Wallet): Promise<Response<any>> => {

    try {
        storageService.secrets.deletePairKey(wallet.pairkey??"")
        storageService.wallets.delete(wallet.key??"")
        if(wallet.default) 
        {
            const wallets = await storageService.wallets.list()
            if(wallets.length) 
            {
                wallets[0].default = true
                await update(wallets[0])

                const user = await storageService.user.get()

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
    await storageService.wallets.update(wallet)
}

const listTransactions = async (wallet: Wallet): Promise<WalletInfo> => {
    if(!wallet.address) 
        throw new Error("wallet address null")
    if(!wallet.network)
        throw new Error("wallet network null")

    const confirmedLabel = await useTranslate("message.transaction.confirmed")
    const notconfirmedLabel = await useTranslate("message.transaction.notconfirmed")
    const response: WalletInfo = { balance: 0, sended: 0, received: 0, transactions: [] }
    const txs: Tx[] = await getTxs(wallet.address, wallet.network)
    const utxos: AddressTxsUtxo[] = await getUtxos(wallet.address, wallet.network)

    for(let tx of txs) 
    {
        let isSended: boolean = tx.vin.some(i => { 
            return i.prevout.scriptpubkey_address == wallet.address
        })

        let sended: number = tx.vin.reduce((sum, input) => {
            if(input.prevout.scriptpubkey_address == wallet.address) 
                return sum + input.prevout.value
            return sum
        }, 0)

        let received: number = tx.vout.reduce((sum, output) => {
            if (output.scriptpubkey_address == wallet.address) 
                return sum + output.value
            return sum
        }, 0)

        const transaction: Transaction = {
            fee: tx.fee,
            txid: tx.txid,
            type: isSended ? "sended" : "received",
            amount: isSended ? (sended-received) : received,
            confirmed: tx.status.confirmed,
            description: tx.status.confirmed ? confirmedLabel 
                : notconfirmedLabel,
            date: tx.status.confirmed ? timeSeconds.toString(tx.status.block_time) 
                : notconfirmedLabel,
            timestamp: tx.status.confirmed ? tx.status.block_time 
                : timeSeconds.now()
        }

        response.transactions.push(transaction)
        response.received += received 
        response.sended += sended 
    }
    
    response.transactions.sort((a, b) => (b.timestamp ?? 1) - (a.timestamp ?? 1));
   
    response.balance = utxos.reduce((sum, item) => sum + item.value, 0)

    return response
}

const getBalance = async (wallet: Wallet) => {
    if(!wallet.address) 
        throw new Error("wallet address null")
    if(!wallet.network)
        throw new Error("wallet network null")
    
    const utxos: AddressTxsUtxo[] = await getUtxos(wallet.address, wallet.network)

    return utxos.reduce((sum, item) => {
        return sum + item.value
    }, 0)
}

interface TransactionProps {
    amount: number,
    destination: string, 
    wallet: Wallet,
    recomendedFee: number
}

const transaction = {
    build: async ({ amount, destination, wallet, recomendedFee }: TransactionProps): Promise<Response<any>> => {

        const pairkey = await storageService.secrets.getPairKey(wallet.pairkey??"")

        const transaction = await createTransaction({
            amount,
            destination,
            recomendedFee,
            wallet,
            pairkey
        })

        return transaction
    },
    send: async (txHex: string, network: BNetwork): Promise<Response<any>> => sendTransaction(txHex, network),
    details: async (txid: string, network: BNetwork, address: string) => await getTransactionInfo({ txid, network, address })
}

const address = {
    validate: (address: string) => ValidateAddress(address)
}

export const walletService = {
    create,
    import: require,
    delete: exclude,
    listTransactions,
    getBalance,
    address,
    transaction
}
