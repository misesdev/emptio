import EncryptedStorage from "react-native-encrypted-storage"
import { BaseEntity } from "../types";

export abstract class BaseSecretStorage<Entity extends BaseEntity> 
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
        return item
    }

    public async add(entity: Entity): Promise<void> {
        const list = await this.list()
        entity.id = list.length
        list.push(entity)
        await this.save(list)
    }

    public async update(entity: Entity) : Promise<void> {
        const list = await this.list()
        list.forEach(item => {
            if(item.id == entity.id) item = entity
        })
        await this.save(list)
    }

    public async remove(entity: Entity): Promise<void> {
        const list = await this.list()
        const updated = list.filter(e => e.id != entity.id)
        await this.save(updated)
    }
    
    public async list(): Promise<Entity[]> {
        let list: Entity[] = []
        let data = await EncryptedStorage.getItem(this._keyStorage)
        if(data)
            list = JSON.parse(data) as Entity[]
        return list
    }

    private async save(entities: Entity[]): Promise<void> {
        await EncryptedStorage.setItem(this._keyStorage, JSON.stringify(entities))
    }
}
