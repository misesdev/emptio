import AsyncStorage from "@react-native-async-storage/async-storage"

export abstract class ItemStorage<Entity> 
{
    private _defaultEntity: Entity;
    private readonly _keyStorage: string;

    constructor(key: string, defaultEntity: Entity) {
        this._defaultEntity = defaultEntity
        this._keyStorage = key
    }

    public async get(): Promise<Entity> {
        let data = await AsyncStorage.getItem(this._keyStorage)
        try {
            if(!data) return this._defaultEntity
            return JSON.parse(data) as Entity
        } 
        catch { return this._defaultEntity }
    }

    public async set(entity: Entity): Promise<void> {
        await AsyncStorage.setItem(this._keyStorage, JSON.stringify(entity))
    }

    public async delete(): Promise<void> {
        await AsyncStorage.removeItem(this._keyStorage)
    }

    public setDefaultEntity(entity: Entity): void {
        this._defaultEntity = entity;
    }

    public async clear(): Promise<void> {
        await AsyncStorage.removeItem(this._keyStorage)
    }
}
