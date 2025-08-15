
export type Balance = {
    received: number;
    sent: number;
    balance: number;
    unconfirmedBalance: number;
    totalBalance: number;
    addressBalances: AddressBalance[];
    received_txs: number;
    sent_txs: number;
    txs: number;
}

export type AddressBalance = {
    address: string;
    received: number;
    sent: number;
    balance: number;
    unconfirmedBalance: number;
    totalBalance: number;
    received_txs: number;
    sent_txs: number;
    txs: number;
}
