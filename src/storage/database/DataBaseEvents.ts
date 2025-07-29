import { NDKEvent } from '@nostr-dev-kit/ndk';
import { TypeCategory } from '@services/notification/application';
import { ChatUser } from '@services/zustand/useChatStore';
import { openDatabaseAsync } from 'expo-sqlite';
import { Database } from './Database';

export type dbEventProps = {
    event: NDKEvent,
    category: TypeCategory,
    chat_id?: string
}

export class DataBaseEvents extends Database
{
    constructor() {
        super("emptio.db", "events")
    }
   
    public async insert({ event, category, chat_id }: dbEventProps) : Promise<boolean> {
        let params: any[] = [
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

        let data = await this.insertEntity(`
            INSERT OR IGNORE INTO ${this._table} (id, kind, pubkey, content, sig, tags, created_at, category, chat_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);

            SELECT changes() AS wasInserted;
        `, params)

        return !!data.changes;
    }

    public async insertInBatch(events: dbEventProps[]) : Promise<dbEventProps[]> {
        if(!events.length) return []

        const eventIds = events.map(e => e.event.id)

        const connection = await this.getConnection()
        const existingEvents = await connection.getAllAsync(`
            SELECT id FROM ${this._table} WHERE id IN (${eventIds.map(() => "?").join(", ")})
        `, eventIds)

        const existingIds = new Set(existingEvents.map((e:any) => e.id))

        const newEvents = events.filter(e => !existingIds.has(e.event.id))

        if (newEvents.length === 0) return []
        
        const placeholders = events.map(() => "(?, ?, ?, ?, ?, ?, ?, ?, ?)").join(", ")
        const params: any[] = []
        
        newEvents.forEach(({ event, category, chat_id }) => {
            params.push(
                event.id, 
                event.kind ?? 0,
                event.pubkey ?? "",
                event.content, 
                event.sig ?? "",
                JSON.stringify(event.tags),
                event.created_at ?? 0,
                category,
                chat_id ?? ""
            )
        })

        await connection.runAsync(`
            INSERT OR IGNORE INTO ${this._table} (id, kind, pubkey, content, sig, tags, created_at, category, chat_id)
            VALUES ${placeholders};
        `, params)

        return newEvents
    }

    public async updateContent(event: NDKEvent) : Promise<void> {
        const connection = await this.getConnection()
        await connection.runAsync(`
            UPDATE ${this._table} SET 
                content = ?
            WHERE id = ?
        `, [event.content, event.id])
    }

    public async listByCategory(category: TypeCategory, limit=100) : Promise<NDKEvent[]> {
        const connection = await this.getConnection()
        const rows = await connection.getAllAsync(`
            SELECT * FROM ${this._table} 
            WHERE category = ? 
                AND deleted = 0 
            ORDER BY created_at DESC LIMIT ?;
        `, [category as string, limit])

        try {
            return (rows??[]).map((event: any): NDKEvent => {
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
        catch { return [] }
    }

    public async listChats() : Promise<ChatUser[]> {
        const connection = await this.getConnection()
        let rows = await connection.getAllAsync(`
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
            FROM ${this._table} as even
            WHERE deleted = 0
                AND category = 'message'
                AND created_at IN (
                    SELECT MAX(created_at)
                    FROM ${this._table}
                    WHERE deleted = 0
                        AND category = 'message'
                    GROUP BY chat_id 
                )
            ORDER BY created_at DESC;
        `)

        try {
            return (rows??[]).map((event: any): ChatUser => {
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
        catch { return [] }
    }

    public async listMessages(chat_id: string) : Promise<NDKEvent[]> {
        const connection = await this.getConnection()
        let rows = await connection.getAllAsync(`
            UPDATE ${this._table} SET status = 'viewed' 
            WHERE category = 'message'
                AND deleted = 0
                AND chat_id = ?
            RETURNING *;
        `, [chat_id])
       
        try {
            return (rows??[]).map((event: any): NDKEvent => {
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
        catch { return [] }
    }

    public static async migrate() : Promise<void> {
        const database = await openDatabaseAsync("emptio.db")
        await database.execAsync(`
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
}

