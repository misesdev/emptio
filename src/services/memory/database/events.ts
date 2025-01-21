import { NDKEvent } from '@nostr-dev-kit/ndk';
import * as SQLite from 'expo-sqlite';
import { TypeCategory } from '../../notification/application';
import { NostrEvent } from "../../nostr/events"

const db: SQLite.SQLiteDatabase =  SQLite.openDatabaseSync('events.db');

export const initDatabase = async () => {
    
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS events (
            id TEXT PRIMARY KEY,            -- Unique ID of event
            kind INTEGER,
            pubkey TEXT,
            category TEXT,                  -- Category (e.g., "feed", "chats", "orders")
            content TEXT,                   -- Content of Event (string)
            sig TEXT,                  
            tags TEXT,                      -- Tags of event (JSON string array)
            status TEXT DEFAULT 'new',      -- State of Event: 'new' or 'viewed'
            created_at INTEGER,              -- Timestamp of creation
            deleted INTEGER default 0
        );
    `)
}

type dbEventProps = {
    event: NDKEvent,
    category: TypeCategory
}
// Inserir um evento, apenas se ele não existir
export const insertEvent = async ({ event, category }: dbEventProps) => {

    const params: SQLite.SQLiteBindParams = [
        event.id, 
        event.kind ?? 0,
        event.pubkey,
        event.content, 
        event.sig ?? "",
        JSON.stringify(event.tags),
        event.created_at ?? 0,
        category
    ]

    await db.runAsync(`
        INSERT OR IGNORE INTO events (id, kind, pubkey, content, sig, tags, created_at, category) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `, params)
};

// Listar eventos por categoria
export const listEventsByCategory = async (category: TypeCategory, limit = 50): Promise<NDKEvent[]> => {
    
    const rows = await db.getAllAsync(`
        SELECT * FROM events WHERE category = ? AND deleted = 0 ORDER BY created_at DESC LIMIT ?;
    `, [category as string, limit])

    return rows.map((event: any): NDKEvent => {
        return { 
            id: event.id,
            kind: event.kind,
            pubkey: event.pubkey,
            content: event.content,
            sig: event.sig,
            tags: JSON.parse(event.tags),
            created_at: event.created_at
        } as NDKEvent
    })
}

// Deletar eventos por uma condição
export const deleteEventsByCondition = async (condition: string, args: any[]) => {
    await db.runAsync(`
        UPDATE events SET deleted = 1 WHERE ${condition};  
    `, args)
}

export const selecMessageChats = async (): Promise<NostrEvent[]> => {
    const rows = await db.getAllAsync(`
        --DELETE FROM events;
        SELECT id, kind, pubkey, category, content, sig, tags, status, created_at, deleted
        FROM events
        WHERE deleted = 0
            AND category = 'message'
            AND created_at IN (
                SELECT MAX(created_at)
                FROM events
                WHERE deleted = 0
                GROUP BY pubkey
            )
        ORDER BY created_at DESC;
    `)

    return rows.map((event: any): NostrEvent => {
        return { 
            id: event.id,
            kind: event.kind,
            pubkey: event.pubkey,
            content: event.content,
            sig: event.sig,
            tags: JSON.parse(event.tags),
            created_at: event.created_at,
            status: event.status
        } 
    })
}



