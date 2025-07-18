import { openDatabaseAsync } from "expo-sqlite";
import { Database } from "./Database";

export class DataBaseTransaction extends Database 
{
    constructor() {
        super("emptio.db", "transactions")
    }
    
    public static async migrate(): Promise<void> {
        const database = await openDatabaseAsync("emptio.db")
        await database.execAsync(`
            CREATE TABLE IF NOT EXISTS transactions (
                id TEXT PRIMARY KEY,             -- TXID
                address TEXT,                    -- ADDRESS
                type TEXT default 'received',    -- TYPE (sent,received)
                value INTEGER default 0,         -- SATOSHIS
                fee INTEGER default 0,           -- NETWORK FEE
                block_height INTEGER default 0,  -- BLOCK HEIGHT
                block_time INTEGER default 0,    -- BLOCK TIME
            );
        `)
    }
}
