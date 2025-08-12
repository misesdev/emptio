import { WalletStorage } from "@storage/wallets/WalletStorage";
import { PrivateKeyStorage } from "@storage/pairkeys/PrivateKeyStorage";
import { AddWalletProps, IWalletService, SendTransactionProps } from "./IWalletService";
import { AppResponse, trackException } from "../telemetry";
import { StoredItem } from "@storage/types";
import { ECPairKey, HDKManager, HDTransaction, HDWallet,
    InputTransaction } from "bitcoin-tx-lib";
import TransactionService from "./TransactionService";
import { BTransaction } from "./types/Transaction";
import { Wallet } from "./types/Wallet";
import { UTXO } from "./types/Utxo";
import { FeeRate } from "./types/FeeRate";

export default class WalletService implements IWalletService 
{
    private _hdwallet!: HDWallet;
    private _wallet!: StoredItem<Wallet>;
    private readonly _storage: WalletStorage;
    private readonly _keyStorage: PrivateKeyStorage;
    private _transaction!: TransactionService;
    protected _addresses: number;
    constructor(
        addresses: number = 10,
        storage: WalletStorage = new WalletStorage(),
        keyStorage: PrivateKeyStorage = new PrivateKeyStorage()
    ) {
        this._storage = storage 
        this._keyStorage = keyStorage
        this._addresses = addresses
    }

    public async init(id: string) : Promise<void> 
    {
        this._wallet = await this._storage.get(id) 
        const masterSeed = await this._keyStorage.get(this._wallet.entity.keyRef)
        const hdkManager = HDKManager.fromMasterSeed(masterSeed.entity)
        this._hdwallet = new HDWallet(hdkManager, { 
            network: this._wallet.entity.network ?? "mainnet" 
        })
        this._transaction = new TransactionService(this._hdwallet.network)
    }

    public async add({ name, masterKey, network="mainnet" }: AddWalletProps): Promise<AppResponse<StoredItem<Wallet>>> 
    {
        try {
            const storeds = await this._storage.list()
            const storedKey = await this._keyStorage.add(masterKey)
            const storedWallet = await this._storage.add({
                name: name,
                keyRef: storedKey.id,
                default: storeds.length <= 0,
                network: network,
                payfee: false
            })
            return { 
                data: storedWallet, 
                success: true
            }
        } 
        catch(ex) {
            return trackException(ex)
        }
    }

    public async get(id: string): Promise<Wallet> 
    {
        const list = await this.list()
        const entity = list.find(e => e.id == id)?.entity
        if(!entity)
            throw new Error("Wallet not found")
        return entity 
    }
    
    public async list(): Promise<StoredItem<Wallet>[]> 
    {
        const list = await this._storage.list()
        return list
    }

    public async update(id: string, wallet: Wallet): Promise<AppResponse<string>>
    {
        try 
        {
            if(wallet.default) 
            {
                const list = await this.list()
                const itens = list.filter(w => w.entity.default)
                for(let item of itens) 
                {
                    item.entity.default = false
                    await this._storage.update(item.id, item.entity)
                }
            }
            await this._storage.update(id, wallet)
            return { 
                data: "Wallet updated successfully", 
                success: true
            }
        }
        catch(ex) {
            return trackException(ex)
        }
    }

    public async delete(id: string): Promise<AppResponse<string>> 
    {
        try 
        {
            const wallet = await this._storage.get(id)
            if(wallet.entity) {
                const masterKey = await this._keyStorage.get(wallet.entity.keyRef)
                await this._keyStorage.delete(masterKey.id)
                await this._storage.delete(wallet.id)
            }
            return { 
                data: "Wallet deleted successfully",
                success: true
            }
        }
        catch(ex) {
            return trackException(ex)
        }
    }

    public async listReceiveAddresses(quantity: number=10)
    {
        return this._hdwallet.listReceiveAddresses(quantity)
    }

    public async listChangeAddresses(quantity: number=10)
    {
        return this._hdwallet.listChangeAddresses(quantity)
    }
    
    public async listUtxos(cached: boolean = false): Promise<AppResponse<UTXO[]>> 
    {
        try {
            if(!this._wallet)
                throw new Error("Please start this class with .init(id)")
            const addresses: string[] = []
            this._hdwallet.listReceiveAddresses(this._addresses)
                .forEach(address => addresses.push(address))
            this._hdwallet.listChangeAddresses(this._addresses)
                .forEach(address => addresses.push(address))

            const utxoResults = await Promise.all(
                addresses.map(address => 
                    this._transaction.getUtxos(address, cached).catch(fail => {
                        console.log(fail)
                        return []
                    })
                )
            )

            const data = utxoResults.flat()
            return { success: true, data }
        }
        catch (ex) {
            return trackException(ex)
        }
    }

    public async allTransactions(): Promise<AppResponse<BTransaction[]>>
    {
        try {
            const transactions = await this._transaction.allTransactions()
            return { success: true, data: transactions }
        } catch(ex) {
            return trackException(ex)
        }
    }

    public async listTransactions(cached: boolean = false): Promise<AppResponse<BTransaction[]>> 
    {
        try {
            if(!this._wallet)
                throw new Error("Please start this class with .init(id)")
            const addresses: string[] = []
            this._hdwallet.listReceiveAddresses(this._addresses)
                .forEach(address => addresses.push(address))
            this._hdwallet.listChangeAddresses(this._addresses)
                .forEach(address => addresses.push(address))

            const txResults = await Promise.all(
                addresses.map(address => 
                    this._transaction.getTransactions(address, cached).catch(fail => {
                        console.log(fail)
                        return []
                    })
                )
            )

            const data = txResults.flat()
            return { success: true, data }
        } catch(ex) {
            return trackException(ex)
        }
    }

    public async getBalance(cached: boolean = true): Promise<number>
    {
        const result = await this.listUtxos(cached)
        if(!result.success || !result.data) 
            return 0
        const lastBalance = result.data.reduce((sum, u) => u.value + sum, 0)
        this._storage.update(this._wallet.id, {
            ...this._wallet.entity,
            lastBalance
        })
        return lastBalance 
    }

    public async getFeeRate(): Promise<AppResponse<FeeRate>> 
    {
        try {
            const data = await this._transaction.getFeeRate()
            return { success: true, data }
        } catch(ex) {
            return trackException(ex)
        }
    }

    public async getBlockHeight(): Promise<AppResponse<number>> 
    {
        try {
            const data = await this._transaction.blocksHight()
            return { success: true, data }
        } catch(ex) {
            return trackException(ex)
        }
    }

    public async send({ address, value, estimatedFee }: SendTransactionProps): Promise<AppResponse<string>>
    {
        try {
            // list cached utxos
            const utxoResults = await this.listUtxos(true)
            if(!utxoResults.success || !utxoResults.data?.length)
                throw new Error("Insufficient funds")
            // verify the amount with value to send
            const balance = utxoResults.data?.reduce((sum,v) => v.value + sum, 0)
            if(value >= balance)
                throw new Error("Insufficient funds")

            const transaction = new HDTransaction({
                whoPayTheFee: address,
                fee: estimatedFee 
            })

            // receiver output
            transaction.addOutput({ address, amount: value })
            // change output
            transaction.addOutput({
                address: this._hdwallet.getAddress(1),
                amount: 0
            })
            
            const funds = utxoResults.data!.sort((a, b) => b.value - a.value)
            for(let utxo of funds) 
            {
                transaction.addInput(utxo as InputTransaction, this.getPairKey(utxo.address))
                let balance = transaction.inputs.reduce((sum, v) => v.value + sum, 0)
                if(balance > value) break;
            }

            await this._transaction.send(transaction.getRawHex())
             
            return { 
                data: "Transaction sended successfully",
                success: true
            }
        } 
        catch(ex) {
            return trackException(ex)
        }
    }

    private getPairKey(address: string): ECPairKey
    {
        const pairkeys = this._hdwallet.listPairKeys(this._addresses)
        const pairkey = pairkeys?.find(p => p.getAddress() == address)
        if(!pairkey) 
            throw new Error("Pair key not found")
        return pairkey
    }
}



