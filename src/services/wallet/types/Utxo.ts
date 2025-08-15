
export type Utxo = {
    txid: string;
    address: string;
    value: number;
    vout: number;
    confirmed: boolean;
    block_height: number;
    block_time: number;
    block_hash: string;
}
