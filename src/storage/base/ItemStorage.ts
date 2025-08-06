import AsyncStorage from "@react-native-async-storage/async-storage"

export abstract class ItemStorage<Entity> 
{
    private _defaultEntity: Entity;
    private readonly _keyStorage: string;

    constructor(key: string, defaultEntity: Entity) 
    {
        this._defaultEntity = defaultEntity
        this._keyStorage = key
    }

    public async get(): Promise<Entity>
    {
        let result: Entity = this._defaultEntity
        let data = await AsyncStorage.getItem(this._keyStorage)
        if(data) 
             result = JSON.parse(data) as Entity
        return result
    }

    public async set(entity: Entity): Promise<void> 
    {
        await AsyncStorage.setItem(this._keyStorage, JSON.stringify(entity))
    }

    public async delete(): Promise<void> 
    {
        await AsyncStorage.removeItem(this._keyStorage)
    }

    public setDefaultEntity(entity: Entity): void 
    {
        this._defaultEntity = entity;
    }

    public async clear(): Promise<void> 
    {
        await AsyncStorage.removeItem(this._keyStorage)
    }
}
