import AsyncStorage from "@react-native-async-storage/async-storage"
import { BaseEntity } from "../types";

export abstract class BaseStorage<Entity extends BaseEntity> 
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
        this.save(list)
    }

    public async list(): Promise<Entity[]> {
        let list: Entity[] = []
        let data = await AsyncStorage.getItem(this._keyStorage)
        if(data)
            list = JSON.parse(data) as Entity[]
        return list
    }

    public async remove(entity: Entity): Promise<void> {
        const list = await this.list()
        this.save(list.filter(e => e.id != entity.id))
    }

    private async save(entities: Entity[]): Promise<void> {
        await AsyncStorage.setItem(this._keyStorage, JSON.stringify(entities))
    }
}
