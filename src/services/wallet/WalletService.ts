import { WalletStorage } from "@storage/wallets/WalletStorage";
import { PrivateKeyStorage } from "@storage/pairkeys/PrivateKeyStorage";
import { AddWalletProps, IWalletService, SendTransactionProps } from "./IWalletService";
import { AppResponse, trackException } from "../telemetry";
import { StoredItem } from "@storage/types";
import { ECPairKey, HDKManager, HDTransaction, HDWallet,
    InputTransaction } from "bitcoin-tx-lib";
import TransactionService from "./TransactionService";
import { Wallet } from "./types/Wallet";
import { UTXO } from "./types/Utxo";
import { BTransaction } from "./types/Transaction";
import { FeeRate } from "./types/FeeRate";

export default class WalletService implements IWalletService 
{
    private _wallet!: HDWallet;
    private readonly _storage: WalletStorage;
    private readonly _keyStorage: PrivateKeyStorage;
    private _transaction!: TransactionService;
    protected _addresses: number;
    constructor(
        addresses: number = 15,
        storage: WalletStorage = new WalletStorage(),
        keyStorage: PrivateKeyStorage = new PrivateKeyStorage()
    ) {
        this._storage = storage 
        this._keyStorage = keyStorage
        this._addresses = addresses
    }

    public async load(id: string) : Promise<void> 
    {
        const stored = await this._storage.get(id) 
        const masterSeed = await this._keyStorage.get(stored.entity.keyRef)
        const hdkManager = HDKManager.fromMasterSeed(masterSeed.entity)
        this._wallet = new HDWallet(hdkManager, { 
            network: stored.entity.network ?? "mainnet" 
        })
        this._transaction = new TransactionService(this._wallet.network)
    }

    public async add({ name, masterKey, network="mainnet" }: AddWalletProps): Promise<AppResponse<string>> 
    {
        try {
            const storedKey = await this._keyStorage.add(masterKey)
            await this._storage.add({
                name: name,
                keyRef: storedKey.id,
                network: network,
                payfee: false
            })
            return { 
                data: "Wallet saved successfully", 
                success: true
            }
        } 
        catch(ex) {
            return trackException(ex)
        }
    }

    public async get(id: string): Promise<AppResponse<Wallet>> 
    {
        try {
            const list = await this.list()
            const entity = list.find(e => e.id == id)?.entity
            if(!entity)
                throw new Error("Wallet not found")
            return { success: true, data: entity } 
        } catch(ex) {
            return trackException(ex)
        }
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

    public async listUtxos(cached: boolean = false): Promise<AppResponse<UTXO[]>> 
    {
        try {
            if(!this._wallet)
                throw new Error("Please start this class with .init(id)")
            const addresses: string[] = []
            this._wallet.listReceiveAddresses(this._addresses)
                .forEach(address => addresses.push(address))
            this._wallet.listChangeAddresses(this._addresses)
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

    public async listTransactions(cached: boolean = false): Promise<AppResponse<BTransaction[]>> 
    {
        try {
            if(!this._wallet)
                throw new Error("Please start this class with .init(id)")
            const addresses: string[] = []
            this._wallet.listReceiveAddresses(this._addresses)
                .forEach(address => addresses.push(address))
            this._wallet.listChangeAddresses(this._addresses)
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
                address: this._wallet.getAddress(1),
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
        const pairkeys = this._wallet?.listPairKeys(this._addresses)
        const pairkey = pairkeys?.find(p => p.getAddress() == address)
        if(!pairkey) 
            throw new Error("Pair key not found")
        return pairkey
    }
}



