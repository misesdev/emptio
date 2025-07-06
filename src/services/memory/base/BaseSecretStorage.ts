import EncryptedStorage from "react-native-encrypted-storage"
import { StoredItem } from "../types";

export abstract class BaseSecretStorage<Entity> 
{
    private readonly _keyStorage: string;
    protected notFoundMessage: string = "item not found in storage";

    constructor(key: string) {
        this._keyStorage = key
    }

    public async get(id: number): Promise<Entity> {
        const list = await this.list()
        let item = list.find(e => e.id == id)
        if(!item) throw new Error(this.notFoundMessage)
        return item.entity
    }

    public async add(entity: Entity): Promise<StoredItem<Entity>> {
        const list = await this.list()
        let storeEntity: StoredItem<Entity> = { 
            id: list.length, 
            entity 
        }
        list.push(storeEntity)
        await this.save(list)
        return storeEntity
    }

    public async update(id: number, entity: Entity): Promise<void> {
        const list = await this.list();
        const index = list.findIndex(item => item.id === id);
        if (index === -1) throw new Error(this.notFoundMessage);
        list[index].entity = entity;
        await this.save(list);
    }

    public async remove(id: number): Promise<void> {
        const list = await this.list()
        const updated = list.filter(e => e.id != id)
        await this.save(updated)
    }
    
    public async list(): Promise<StoredItem<Entity>[]> {
        let list: StoredItem<Entity>[] = []
        let data = await EncryptedStorage.getItem(this._keyStorage)
        if(data)
            list = JSON.parse(data) as StoredItem<Entity>[]
        return list
    }

    private async save(entities: StoredItem<Entity>[]): Promise<void> {
        await EncryptedStorage.setItem(this._keyStorage, JSON.stringify(entities))
    }
    
    public async clear(): Promise<void> {
        await EncryptedStorage.removeItem(this._keyStorage)
    }
}
