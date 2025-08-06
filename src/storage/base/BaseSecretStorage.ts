import EncryptedStorage from "react-native-encrypted-storage"
import { StoredItem } from "../types";
import { v4 as uuid } from "uuid";

export abstract class BaseSecretStorage 
{
    private readonly _keyStorage: string;
    protected notFoundMessage: string = "item not found in storage";

    constructor(key: string) 
    {
        this._keyStorage = key
    }

    public async get(id: string): Promise<StoredItem<Uint8Array>> 
    {
        const list = await this.list()
        let item = list.find(e => e.id == id)
        if(!item) throw new Error(this.notFoundMessage)
        return item
    }
    
    public async getEntity(id: string): Promise<Uint8Array> 
    {
        const item = await this.get(id)
        return item.entity
    }

    public async add(entity: Uint8Array): Promise<StoredItem<Uint8Array>> 
    {
        const list = await this.list()
        let storeEntity: StoredItem<Uint8Array> = { 
            id: uuid(), 
            entity 
        }
        list.push(storeEntity)
        await this.save(list)
        return storeEntity
    }

    public async update(id: string, entity: Uint8Array): Promise<void> 
    {
        const list = await this.list();
        const index = list.findIndex(item => item.id === id);
        if (index === -1) throw new Error(this.notFoundMessage);
        list[index].entity = entity;
        await this.save(list);
    }

    public async delete(id: string): Promise<void> 
    {
        const list = await this.list()
        const updated = list.filter(e => e.id != id)
        await this.save(updated)
    }
    
    public async list(): Promise<StoredItem<Uint8Array>[]> 
    {
        let list: StoredItem<number[]>[] = []
        let data = await EncryptedStorage.getItem(this._keyStorage)
        if(data)
            list = JSON.parse(data) as StoredItem<number[]>[]
        return list.map(e => {
            return { 
                id: e.id,
                entity: new Uint8Array(e.entity)
            }
        })
    }

    public async listEntities(): Promise<Uint8Array[]> 
    {
        const list = await this.list()
        return list.map(e => e.entity)
    }

    private async save(entities: StoredItem<Uint8Array>[]): Promise<void>
    {
        const list = entities.map((e): StoredItem<number[]> => {
            return {
                id: e.id,
                entity: Array.from(e.entity)
            }
        })
        await EncryptedStorage
            .setItem(this._keyStorage, JSON.stringify(list))
    }
    
    public async clear(): Promise<void> 
    {
        await EncryptedStorage.removeItem(this._keyStorage)
    }
}
