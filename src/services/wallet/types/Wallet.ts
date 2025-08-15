import { BNetwork } from "bitcoin-tx-lib";

export type Wallet = {
    name?: string;
    default?: boolean;
    lastBalance?: number;
    lastSended?: number;
    lastReceived?: number;
    network?: BNetwork;
    payfee?: boolean;
    keyRef: string;
}
