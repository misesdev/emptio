import { openDatabaseAsync } from "expo-sqlite";
import { Database } from "./Database";

export class DataBaseUtxo extends Database 
{
    constructor() {
        super("emptio.db", "utxos")
    }
    
    public static async migrate(): Promise<void> {
        const database = await openDatabaseAsync("emptio.db")
        await database.execAsync(`
            CREATE TABLE IF NOT EXISTS utxos (
                id TEXT PRIMARY KEY,             -- TXID
                value INTEGER default 0,         -- SATOSHIS
                vout INTEGER default 0,          -- VOUT (Output index)
                block_height INTEGER default 0,  -- BLOCK HEIGHT
                block_time INTEGER default 0,    -- BLOCK TIME
                block_hash TEXT                  -- BLOCK HASH 
            );
        `)
    }
}
