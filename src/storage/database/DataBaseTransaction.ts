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
                script TEXT,                     -- SCRIPT PUBKEY
                value INTEGER default 0,         -- SATOSHIS
                vout INTEGER,                    -- VOUT output index
                payer TEXT,                      -- ADDRESS of Payer
                receiver TEXT,                   -- ADDRESS of Receiver
                confirmations INTEGER default 0, -- BLOCK HEIGHT
                deleted INTEGER default 0
            );
        `)
    }
}
