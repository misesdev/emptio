import { Currency } from "@src/constants/Currencies"
import NostrPairKey from "../nostr/pairkey/NostrPairKey";
import { ECPairKey } from "bitcoin-tx-lib"

export interface BaseEntity {
    id: number 
}

export interface PrivateKey extends BaseEntity {
    privateKey: Uint8Array;
}

export interface BPairKey extends BaseEntity {
    pairkey: ECPairKey;
}

export interface NPairKey extends BaseEntity {
    pairkey: NostrPairKey; 
}

export interface PairKey {
    key: string,
    privateKey: string,
    publicKey: string
}

export interface FeedVideosSettings {
    VIDEOS_LIMIT: number,
    FETCH_LIMIT: number,
    filterTags: string[],
}

export type Settings = {
    useBiometrics?: boolean,
    currency?: Currency
}

