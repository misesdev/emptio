import { WalletStorage } from "@storage/wallets/WalletStorage";
import { PrivateKeyStorage } from "@storage/pairkeys/PrivateKeyStorage";
import { CreateProps, IWalletService, ImportProps } from "./IWalletService";
import { AppResponse, trackException } from "../telemetry";
import { Wallet } from "@storage/wallets/types";
import { StoredItem } from "@storage/types";
import { HDWallet } from "bitcoin-tx-lib";
import { TransactionService } from "./TransactionService";

export class WalletService implements IWalletService 
{
    private readonly _storage: WalletStorage;
    private readonly _keyStorage: PrivateKeyStorage;
    private readonly _transaction: TransactionService;
    constructor() {
        this._storage = new WalletStorage()
        this._keyStorage = new PrivateKeyStorage()
        this._transaction = new TransactionService()
    }

    public async create({ 
        name, passphrase, network="mainnet" 
    }: CreateProps): Promise<AppResponse<Wallet>> {
        try {
            const { mnemonic, wallet } = HDWallet.create(passphrase, {
                network
            })
            const masterKey = wallet.getMasterPrivateKey()
            const storedKey = await this._keyStorage.add(masterKey)
            const walletData: Wallet = {
                name: name,
                mnemonic: mnemonic,
                keyRef: storedKey.id,
                network: network,
                payfee: false
            }
            const storedWallet = await this._storage.add(walletData)
            return { success: true, data: storedWallet.entity }
        } 
        catch(ex) {
            return trackException(ex)
        }
    }

    public async import({ 
        name, from, passphrase, network="mainnet" 
    }: ImportProps): Promise<AppResponse<Wallet>> {
        try {
            const { wallet } = HDWallet.import(from, passphrase, {
                network
            })
            const masterKey = wallet.getMasterPrivateKey()
            const storedKey = await this._keyStorage.add(masterKey)
            const walletData: Wallet = {
                name: name,
                keyRef: storedKey.id,
                network: network,
                payfee: false
            }
            const storedWallet = await this._storage.add(walletData)
            return { success: true, data: storedWallet.entity }
        } 
        catch(ex) {
            return trackException(ex)
        }
    }

    public async list(): Promise<StoredItem<Wallet>[]> {
        const list = await this._storage.list()
        return list
    }

    public async get(id: string): Promise<Wallet|null> {
        const list = await this.list()
        const entity = list.find(e => e.id == id)?.entity
        return entity ?? null
    }

    public async update(id: string, wallet: Wallet): Promise<void> {
        if(wallet.default) {
            const list = await this.list()
            const item = list.find(w => w.entity.default)
            if(item && item.id != id) {
                item.entity.default = false
                await this._storage.update(item.id, item.entity)
            }
        }
        await this._storage.update(id, wallet)
    }

    public async delete(id: string): Promise<void> {
        const wallet = await this._storage.get(id)
        if(wallet.entity) {
            const masterKey = await this._keyStorage.get(wallet.entity.keyRef)
            await this._keyStorage.delete(masterKey.id)
            await this._storage.delete(wallet.id)
        }
    }
}
