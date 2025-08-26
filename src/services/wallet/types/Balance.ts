
export type Balance = {
    received: number;
    sent: number;
    confirmedBalance: number;
    unconfirmedBalance: number;
    totalBalance: number;
    addrsBalances: AddressBalance[];
    received_txs: number;
    sent_txs: number;
    txs: number;
}

export type AddressBalance = {
    address: string;
    received: number;
    sent: number;
    confirmedBalance: number;
    unconfirmedBalance: number;
    totalBalance: number;
    received_txs: number;
    sent_txs: number;
    txs: number;
}
