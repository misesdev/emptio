import { AppResponse } from "../telemetry";
import { BNetwork } from "bitcoin-tx-lib";
import { Wallet } from "@storage/wallets/types";
import { StoredItem } from "@storage/types";

export type CreateProps = {
    name: string; network?: BNetwork; passphrase?: string;
}
export type ImportProps = {
    name: string; from: string; network?: BNetwork; passphrase?: string;
}

export interface IWalletService {
    create(props: CreateProps): Promise<AppResponse<Wallet>>;
    import(props: ImportProps): Promise<AppResponse<Wallet>>;

    get(id: string): Promise<Wallet|null>;
    update(id: string, wallet: Wallet): Promise<void>;
    delete(id: string): Promise<void>;
    list(): Promise<StoredItem<Wallet>[]>;
}
