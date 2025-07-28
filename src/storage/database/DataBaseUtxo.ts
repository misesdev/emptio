import { openDatabaseAsync } from "expo-sqlite";
import { Database } from "./Database";
import { UTXO } from "@services/wallet/types/Utxo";

export class DataBaseUtxo extends Database 
{
    constructor() {
        super("emptio.db", "utxos", "txid")
    }
    
    public static async migrate(): Promise<void> {
        const database = await openDatabaseAsync("emptio.db")
        await database.execAsync(`
            CREATE TABLE IF NOT EXISTS utxos (
                txid TEXT PRIMARY KEY,           -- TXID
                address TEXT,                    -- ADDRESS
                value INTEGER default 0,         -- SATOSHIS
                vout INTEGER default 0,          -- VOUT (Output index)
                confirmed INTEGER default 0,     -- CONFIRMED(boolean)
                block_height INTEGER default 0,  -- BLOCK HEIGHT
                block_time INTEGER default 0,    -- BLOCK TIME
                block_hash TEXT,                 -- BLOCK HASH 
                deleted INTEGER default 0
            );
            CREATE INDEX IF NOT EXISTS idx_utxos_address ON utxos(address);
        `)
    }

    public async list(address: string): Promise<UTXO[]> 
    {
        const connection = await this.getConnection()
        const rows = await connection.getAllAsync(`
            SELECT * FROM ${this._table}
            WHERE address = ?
                AND deleted = 0
        `, [address])
        return (rows??[]).map((utxo: any): UTXO => ({
            txid: utxo.txid,
            address: utxo.address,
            value: utxo.value,
            vout: utxo.vout,
            confirmed: utxo.confirmed == 1,
            block_height: utxo.block_height,
            block_time: utxo.block_time,
            block_hash: utxo.block_hash
        }))
    }

    public async insertUpdateAsync(utxos: UTXO[]): Promise<void>
    {
        if (utxos.length === 0) return;

        const connection = await this.getConnection()

        await connection.withExclusiveTransactionAsync(async tx => {
            for (const utxo of utxos) {
                await tx.runAsync(`
                    INSERT INTO ${this._table} (
                        txid, address, value, vout, confirmed, 
                        block_height, block_time, block_hash, deleted
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
                    ON CONFLICT(txid) DO UPDATE SET
                        address = excluded.address,
                        value = excluded.value,
                        vout = excluded.vout,
                        confirmed = excluded.confirmed,
                        block_height = excluded.block_height,
                        block_time = excluded.block_time,
                        block_hash = excluded.block_hash
                    WHERE ${this._table}.deleted = 0
                `, [
                    utxo.txid,
                    utxo.address,
                    utxo.value,
                    utxo.vout,
                    utxo.confirmed ? 1 : 0,
                    utxo.block_height ?? 0,
                    utxo.block_time ?? 0,
                    utxo.block_hash ?? null
                ])
            }
        })
    }
}
