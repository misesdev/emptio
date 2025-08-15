import IBlockChainService, { BlockChainProps, PushTxProps, TxProps } from "./IBlockChainService";
import { BTransaction } from "../wallet/types/Transaction";
import { AddressBalance, Balance } from "../wallet/types/Balance";
import { Utxo } from "../wallet/types/Utxo";
import axios from "axios"

class BlockCypherService implements IBlockChainService
{
    public async getUtxos({ addrs, network="mainnet" }: BlockChainProps): Promise<Utxo[]> 
    {
        const utxos: Utxo[] = [];
        const apiUrl = network=="mainnet" ? 
            process.env.BLOCKCYPHER_MAIN : process.env.BLOCKCYPHER_TESTNET;
        const response = await axios.get(`${apiUrl}/addrs/${addrs.join(";")}?unspentOnly=true`)
        const arr = Array.isArray(response.data) ? response.data : [response.data];
        for (const addrData of arr) {
            if (!addrData.txrefs) continue;

            for (const utxo of addrData.txrefs) {
                utxos.push({
                    txid: utxo.tx_hash,
                    address: addrData.address,
                    value: utxo.value,
                    vout: utxo.tx_output_n,
                    confirmed: utxo.confirmations && utxo.confirmations > 0,
                    block_height: utxo.block_height ?? 0,
                    block_time: utxo.confirmed ? new Date(utxo.confirmed).getTime() : 0,
                    block_hash: utxo.block_hash ?? "",
                });
            }
        }

        return utxos;
    }

    public async getBalance({ addrs, network="mainnet" }: BlockChainProps): Promise<Balance>
    {
        const apiUrl = network=="mainnet" ? 
            process.env.BLOCKCYPHER_MAIN : process.env.BLOCKCYPHER_TESTNET;
        const response = await axios.get(`${apiUrl}/addrs/${addrs.join(";")}`)
        const balances = Array.isArray(response.data) ? response.data : [response.data];
        const addressBalances: AddressBalance[] = balances.map((addr: any) => {
            const balace: AddressBalance = {
                address: addr.address,
                received: addr.total_received,
                sent: addr.total_sent,
                balance: addr.balance,
                unconfirmedBalance: addr.unconfirmed_balance,
                totalBalance: addr.final_balance,
                received_txs: 0, 
                sent_txs: 0,     
                txs: addr.n_tx,
            }
            addr.txrefs.forEach((tx: any) => {
                if (tx.tx_input_n === -1) 
                    balace.received_txs++;
                else 
                    balace.sent_txs++;
            })
            return balace
        });
        const balance = addressBalances.reduce((acc, ab) => {
                acc.sent += ab.sent;
                acc.received += ab.received;
                acc.balance += ab.balance;
                acc.unconfirmedBalance += ab.unconfirmedBalance;
                acc.totalBalance += ab.totalBalance;
                acc.received_txs += ab.received_txs;
                acc.sent_txs += ab.sent_txs;
                acc.txs += ab.txs;
                return acc;
            },
            {
                received: 0,
                sent: 0,
                balance: 0,
                unconfirmedBalance: 0,
                totalBalance: 0,
                received_txs: 0,
                sent_txs: 0,
                txs: 0
            }
        );
        const totalBalance: Balance = { ...balance, addressBalances  };
        return totalBalance
    }

    public async listTransactions({ addrs, network="mainnet" }: BlockChainProps): Promise<BTransaction[]> 
    {
        const apiUrl = network=="mainnet" ? 
            process.env.BLOCKCYPHER_MAIN : process.env.BLOCKCYPHER_TESTNET;

        return []
    }

    public async getTransaction({ txid, network="mainnet" }: TxProps): Promise<BTransaction>
    {
        const apiUrl = network=="mainnet" ? 
            process.env.MEMPOOL_MAIN : process.env.MEMPOOL_TESTNET;

        return {} as BTransaction        
    }
    
    public async pushTransaction({ tx, network="mainnet" }: PushTxProps): Promise<string>
    {
        const apiUrl = network=="mainnet" ? 
            process.env.BLOCKCYPHER_MAIN : process.env.BLOCKCYPHER_TESTNET;

        return "txid"
    }
}

export default BlockCypherService
