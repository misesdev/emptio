export type StoredItem<Entity> = {
    id: number;
    entity: Entity
}

export interface PairKey {
    key: string,
    privateKey: string,
    publicKey: string
}

