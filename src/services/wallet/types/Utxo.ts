
export type UTXO = {
    txid: string;
    value: number;
    vout: number;
    confirmed: boolean;
    block_height: number;
    block_hash: string;
    block_time: number;
}
