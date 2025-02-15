import { NDKEvent } from '@nostr-dev-kit/ndk';
import * as SQLite from 'expo-sqlite';
import { TypeCategory } from '../../notification/application';
import { ChatUser } from '../../zustand/chats';

let database: SQLite.SQLiteDatabase

const getDatabaseConnection = async () : Promise<SQLite.SQLiteDatabase> => {
    if(!database)
        database = await SQLite.openDatabaseAsync('events.db');
    return database
}

export const initDatabase = async () => {
    const db = await getDatabaseConnection()

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS events (
            id TEXT PRIMARY KEY,            -- Unique ID of event
            kind INTEGER,
            pubkey TEXT,
            category TEXT,                  -- Category (e.g., "feed", "chats", "orders")
            chat_id TEXT,
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
    category: TypeCategory,
    chat_id?: string
}

export const insertEvent = async ({ event, category, chat_id }: dbEventProps) : Promise<boolean> => {
    const db = await getDatabaseConnection()

    const params = [
        event.id, 
        event.kind ?? 0,
        event.pubkey ?? "",
        event.content, 
        event.sig ?? "",
        JSON.stringify(event.tags),
        event.created_at ?? 0,
        category,
        chat_id ?? ""
    ]

    const data = await db.runAsync(`
        INSERT OR IGNORE INTO events (id, kind, pubkey, content, sig, tags, created_at, category, chat_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);

        SELECT changes() AS wasInserted;
    `, params)

    return !!data.changes;
}

export const updateEventContent = async (event: NDKEvent) => {
    const db = await getDatabaseConnection()

    await db.runAsync(`
        UPDATE events SET 
            content = ?
        WHERE id = ?
    `, [event.content, event.id])
}

export const listEventsByCategory = async (category: TypeCategory, limit = 50): Promise<NDKEvent[]> => {
    const db = await getDatabaseConnection()

    const rows = await db.getAllAsync(`
        SELECT * FROM events WHERE category = ? AND deleted = 0 ORDER BY created_at DESC LIMIT ?;
    `, [category as string, limit])

    if(!rows) return []

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
    const db = await getDatabaseConnection()

    await db.runAsync(`
        UPDATE events SET deleted = 1 WHERE ${condition};  
    `, args)
}

export const selecMessageChats = async (): Promise<ChatUser[]> => {
    const db = await getDatabaseConnection()

    const rows = await db.getAllAsync(`
        --DELETE FROM events;
        SELECT even.id, 
            even.kind, 
            even.pubkey, 
            even.chat_id, 
            even.content, 
            even.sig, 
            even.tags, 
            even.status, 
            even.created_at,
            (
                SELECT COUNT(*)
                FROM events as even2
                WHERE even2.chat_id = even.chat_id
                    AND even2.status = 'new'
                    AND even2.category = 'message'
                    AND deleted = 0
            ) as unreadCount
        FROM events as even
        WHERE deleted = 0
            AND category = 'message'
            AND created_at IN (
                SELECT MAX(created_at)
                FROM events
                WHERE deleted = 0
                    AND category = 'message'
                GROUP BY chat_id 
            )
        ORDER BY created_at DESC;
    `)

    if(!rows) return []

    return rows.map((event: any): ChatUser => {
        return { 
            chat_id: event.chat_id,
            unreadCount: event.unreadCount,
            lastMessage:  {
                id: event.id as string,
                kind: event.kind as number,
                pubkey: event.pubkey as string,                                                                                                                                                                                                                
                content: event.content as string,
                sig: event.sig as string,
                tags: JSON.parse(event.tags) as string[][],
                created_at: event.created_at as number,
            } as NDKEvent
        } 
    })
}

export const selecMessages = async (chat_id: string): Promise<NDKEvent[]> => {
    const db = await getDatabaseConnection()

    const rows = await db.getAllAsync(`
        UPDATE events SET status = 'viewed' 
        WHERE category = 'message'
            AND deleted = 0
            AND chat_id = ?
        RETURNING *;
    `, [chat_id])
   
    if(!rows) return []

    return rows.map((event: any): NDKEvent => {
        return { 
            id: event.id,
            kind: event.kind,
            pubkey: event.pubkey,
            content: event.content,
            sig: event.sig,
            tags: JSON.parse(event.tags),
            created_at: event.created_at,
        } as NDKEvent
    })
}

// Deletar eventos por uma condição
export const clearEvents = async () => {
    const db = await getDatabaseConnection()

    await db.execAsync(` DELETE FROM events; `)

    //await db.closeAsync()
}



