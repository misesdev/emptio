import { BaseEntity } from "@services/memory/types";

export interface UserEntity extends BaseEntity {
    user: User;
}

export type User = {
    name?: string,
    pubkey?: string,
    displayName?: string,
    display_name?: string,
    picture?: string,
    image?: string,
    about?: string,
    bio?: string,
    nip05?: string,
    lud06?: string,
    lud16?: string,
    banner?: string,
    zapService?: string,
    website?: string,
    keychanges?: string,
    similarity?: number,
    friend?: boolean
}

