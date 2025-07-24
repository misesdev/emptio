
export type BTransaction = {
    txid: string;
    value: number;
    fee: number;
    confirmed: boolean;
    block_height: number;
    block_time: number;
    type: "sent" | "received";
    address: string;
}
