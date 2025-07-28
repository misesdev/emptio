
export type BTransaction = {
    txid: string;
    type: "sent" | "received";
    value: number;
    fee: number;
    confirmed: boolean;
    block_height: number;
    block_time: number;
    block_hash: string;
    participants: BParticitant[];
}

export type BParticitant = {
    txid: string;
    type: "input" | "output";
    address: string;
    value: number;
}
