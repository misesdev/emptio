import { getTransactionInfo, getUtxos } from "@services/bitcoin/mempool"
import { useTranslate } from "@services/translate"
import { Tx } from "@mempool/mempool.js/lib/interfaces/bitcoin/transactions"
import { createTransaction, createWallet, ValidateAddress, 
    sendTransaction, importWallet, BaseWallet } from "@services/bitcoin"
import { getRandomKey } from "@services/bitcoin/signature"
import { Transaction, Wallet, WalletInfo, WalletType } from "@services/memory/types"
import { Response, trackException } from "@services/telemetry"
import { timeSeconds } from "@services/converter"
import { storageService } from "@services/memory"
import { userService } from "../user"
import { Address, BNetwork } from "bitcoin-tx-lib"

type Props = {
    name: string,
    type: WalletType,
    password: string
}

const create = async ({ name, type, password }: Props): Promise<Response<BaseWallet>> => {
    try {
        const wallets = await walletService.list()

        const network: BNetwork = type == "bitcoin" ? "mainnet" : "testnet"

        const base: BaseWallet = createWallet(password, network)
        
        const address = Address.fromPubkey({
            pubkey: base.pairkey.publicKey, network
        })

        base.wallet = {
            name,
            type,
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

        await storageService.pairkeys.add(base.pairkey)

        await storageService.wallets.add(base.wallet)

        return { success: true, message: "success", data: base }
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
        const wallets = await walletService.list()

        const network: BNetwork = type == "bitcoin" ? "mainnet" : "testnet"

        const base = await importWallet(mnemonic, password, network)
        
        const address = Address.fromPubkey({ 
            pubkey: base.pairkey.publicKey, network
        })

        base.wallet = {
            name,
            type,
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

        await storageService.pairkeys.add(base.pairkey)

        await storageService.wallets.add(base.wallet)

        return { success: true, message: "", data: base }
    }
    catch (ex) {
        return trackException(ex)
    }
}

const exclude = async (wallet: Wallet): Promise<Response<any>> => {

    try {
        storageService.pairkeys.delete(wallet.pairkey??"")
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
    if(!wallet.address) throw new Error("wallet address null")
    if(!wallet.network) throw new Error("wallet network null")

    const utxos: Tx[] = await getUtxos(wallet.address, wallet.network)
    const confirmedLabel = await useTranslate("message.transaction.confirmed")
    const notconfirmedLabel = await useTranslate("message.transaction.notconfirmed")
    const response: WalletInfo = { balance: 0, sended: 0, received: 0, transactions: [] }

    for(let i = 0; i < utxos.length; i++) {
        const utxo = utxos[i]
        
        let received: number = 0, sended: number = 0
        
        let isSended: boolean = utxo.vin.filter(i => { 
            return i.prevout.scriptpubkey_address == wallet.address
        }).length > 0

        utxo.vin.forEach(tx => {
            if(tx.prevout.scriptpubkey_address == wallet.address) sended += tx.prevout.value
        })

        utxo.vout.forEach((tx) => {
            if (tx.scriptpubkey_address == wallet.address) received += tx.value
        })

        const transaction: Transaction = {
            fee: utxo.fee,
            txid: utxo.txid,
            type: isSended ? "sended" : "received",
            amount: isSended ? (sended-received) : received,
            confirmed: utxo.status.confirmed,
            description: utxo.status.confirmed ? confirmedLabel 
                : notconfirmedLabel,
            date: utxo.status.confirmed ? timeSeconds.toString(utxo.status.block_time) 
                : notconfirmedLabel,
            timestamp: utxo.status.confirmed ? utxo.status.block_time 
                : timeSeconds.now()
        }
        response.transactions.push(transaction)
        response.received += received
        response.sended += sended
    }

    response.transactions.sort((a, b) => (b.timestamp ?? 1) - (a.timestamp ?? 1));
    
    response.balance = response.received - response.sended

    return response
}

interface TransactionProps {
    amount: number,
    destination: string, 
    walletKey: string,
    recomendedFee: number
}

const transaction = {
    build: async ({ amount, destination, walletKey, recomendedFee }: TransactionProps): Promise<Response<any>> => {

        const wallet = await storageService.wallets.get(walletKey)

        const pairkey = await storageService.pairkeys.get(wallet.pairkey??"")

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
    update: storageService.wallets.update,
    import: require,
    delete: exclude,
    listTransactions,
    list: storageService.wallets.list,
    address,
    transaction
}
