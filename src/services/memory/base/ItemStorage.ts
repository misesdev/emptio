
import AsyncStorage from "@react-native-async-storage/async-storage"

export abstract class ItemStorage<Entity> 
{
    private readonly _keyStorage: string;
    private _defaultEntity: Entity|null;

    constructor(key: string, defaultEntity: Entity|null=null) {
        this._keyStorage = key
        this._defaultEntity = defaultEntity
    }

    public async get(): Promise<Entity|null> {
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
