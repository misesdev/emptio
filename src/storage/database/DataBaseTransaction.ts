import { openDatabaseAsync } from "expo-sqlite";
import { Database } from "./Database";
import { BParticitant, BTransaction } from "@services/wallet/types/Transaction";

export class DataBaseTransaction extends Database 
{
    constructor() {
        super("emptio.db", "transactions", "txid")
    }
    
    public static async migrate(): Promise<void> {
        const database = await openDatabaseAsync("emptio.db")
        await database.execAsync(`
            CREATE TABLE IF NOT EXISTS transactions (
                txid TEXT PRIMARY KEY,           -- TXID
                type TEXT default 'received',    -- TYPE (sent,received)
                value INTEGER default 0,         -- SATOSHIS
                fee INTEGER default 0,           -- NETWORK FEE
                block_height INTEGER default 0,  -- BLOCK HEIGHT
                block_time INTEGER default 0,    -- BLOCK TIME
                block_hash TEXT,                 -- BLOCK HASH 
                deleted INTEGER default 0
            );
            
            CREATE TABLE IF NOT EXISTS participants (
                txid TEXT NOT NULL,
                address TEXT NOT NULL,
                type TEXT NOT NULL CHECK(type IN ('input', 'output')),
                value INTEGER DEFAULT 0,
                deleted INTEGER DEFAULT 0,
                PRIMARY KEY (txid, address, type),
                FOREIGN KEY (txid) REFERENCES transactions(txid) ON DELETE CASCADE
            );

            CREATE INDEX IF NOT EXISTS idx_participants_address ON participants(address);
        `)
    }

    public async getByTxid(txid: string): Promise<BTransaction | null>
    {
        const db = await this.getConnection();
        const tx: any = await db.getFirstAsync(`
            SELECT * 
            FROM transactions
            WHERE txid = ? 
                AND deleted = 0
        `,[txid]);

        if (!tx) return null;

        const participants = await db.getAllAsync<BParticitant>(`
            SELECT * FROM participants WHERE txid = ? AND deleted = 0
        `, [tx.txid])

        return {
            txid: tx.txid, 
            type: tx.type ?? "received",
            value: tx.value,
            fee: tx.fee,
            confirmed: tx.confirmed == 1,
            block_height: tx.block_height,
            block_time: tx.block_time,
            block_hash: tx.block_hash,
            participants: participants
        }
    }

    public async all(): Promise<BTransaction[]>
    {
        const results: BTransaction[] = [];
        const db = await this.getConnection()
        const rows: any = await db.getAllAsync(`
            SELECT t.* 
            FROM transactions t
                JOIN participants p ON t.txid = p.txid
            WHERE t.deleted = 0 
                AND p.deleted = 0
        `)
        for(const tx of rows) {
            const participants = await db.getAllAsync<BParticitant>(`
                SELECT * FROM participants WHERE txid = ? AND deleted = 0
            `, [tx.txid]);
            results.push({
                txid: tx.txid, 
                type: tx.type ?? "received",
                value: tx.value,
                fee: tx.fee,
                confirmed: tx.confirmed == 1,
                block_height: tx.block_height,
                block_time: tx.block_time,
                block_hash: tx.block_hash,
                participants: participants
            })
        }
        return results
    }

    public async list(address: string): Promise<BTransaction[]>
    {
        const results: BTransaction[] = [];
        const db = await this.getConnection()
        const rows: any = await db.getAllAsync(`
            SELECT t.* 
            FROM transactions t
                JOIN participants p ON t.txid = p.txid
            WHERE p.address = ? 
                AND t.deleted = 0 
                AND p.deleted = 0
        `, [address])
        for(const tx of rows) {
            const participants = await db.getAllAsync<BParticitant>(`
                SELECT * FROM participants WHERE txid = ? AND deleted = 0
            `, [tx.txid]);
            results.push({
                txid: tx.txid, 
                type: tx.type ?? "received",
                value: tx.value,
                fee: tx.fee,
                confirmed: tx.confirmed == 1,
                block_height: tx.block_height,
                block_time: tx.block_time,
                block_hash: tx.block_hash,
                participants: participants
            })
        }
        return results
    }

    public async insertUpdateAsync(txs: BTransaction[]): Promise<void> {
        if (txs.length === 0) return;

        const connection = await this.getConnection();

        await connection.withExclusiveTransactionAsync(async tx => {
            for (const transaction of txs) {
                await tx.runAsync(`
                    INSERT INTO ${this._table} (
                        txid, type, value, fee, 
                        block_height, block_time, block_hash, deleted
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
                    ON CONFLICT(txid) DO UPDATE SET
                        type = excluded.type,
                        value = excluded.value,
                        fee = excluded.fee,
                        block_height = excluded.block_height,
                        block_time = excluded.block_time,
                        block_hash = excluded.block_hash
                    WHERE ${this._table}.deleted = 0
                `,
                    [
                        transaction.txid,
                        transaction.type,
                        transaction.value,
                        transaction.fee,
                        transaction.block_height ?? 0,
                        transaction.block_time ?? 0,
                        transaction.block_hash ?? null
                    ]
                )

                for (const part of transaction.participants) {
                    await tx.runAsync(`
                        INSERT INTO participants (
                            txid, address, type, value, deleted
                        ) VALUES (?, ?, ?, ?, 0)
                        ON CONFLICT(txid, address, type) DO UPDATE SET
                            value = excluded.value
                        WHERE participants.deleted = 0
                    `, [
                        part.txid,
                        part.address,
                        part.type,
                        part.value
                    ])
                }
            }
        })
    }
}
