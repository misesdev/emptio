
export type BTransaction = {
    txid: string;
    value: number;
    fee: number;
    confirmed: boolean;
    block_height: number;
    block_time: number;
    block_hash: string;
    participants: BParticitant[];
    type: "sent" | "received";
}

export type BParticitant = {
    txid: string;
    type: "input" | "output";
    address: string;
    value: number;
    vout: number;
}
