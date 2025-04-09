import { NDKEvent } from '@nostr-dev-kit/ndk';
import { TypeCategory } from '@services/notification/application';
import { ChatUser } from '@services/zustand/chats';
import { Database } from './base';

export type dbEventProps = {
    event: NDKEvent,
    category: TypeCategory,
    chat_id?: string
}

export class DBEvents extends Database {
   
    static async initDatabase() : Promise<void> {
        let db = await this.getDatabaseConnection()
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

    static async insert({ event, category, chat_id }: dbEventProps) : Promise<boolean> {
        let db = await this.getDatabaseConnection()
        let params = [
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

        let data = await db.runAsync(`
            INSERT OR IGNORE INTO events (id, kind, pubkey, content, sig, tags, created_at, category, chat_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);

            SELECT changes() AS wasInserted;
        `, params)

        return !!data.changes;
    }

    static async insertInBatch(events: dbEventProps[]) : Promise<dbEventProps[]> {
        if(!events.length) return []

        let db = await this.getDatabaseConnection()
        const eventIds = events.map(e => e.event.id)

        const existingEvents = await db.getAllAsync(`
            SELECT id FROM events WHERE id IN (${eventIds.map(() => "?").join(", ")})
        `, eventIds)

        const existingIds = new Set(existingEvents.map((e:any) => e.id))

        const newEvents = events.filter(e => !existingIds.has(e.event.id))

        if (newEvents.length === 0) return []
        
        const placeholders = events.map(() => "(?, ?, ?, ?, ?, ?, ?, ?, ?)").join(", ")
        const params: any[] = []
        
        events.forEach(({ event, category, chat_id }) => {
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

        await db.runAsync(`
            INSERT OR IGNORE INTO events (id, kind, pubkey, content, sig, tags, created_at, category, chat_id)
            VALUES ${placeholders};
        `, params)

        return newEvents
    }

    static async updateContent(event: NDKEvent) : Promise<void> {
        let db = await this.getDatabaseConnection()
        await db.runAsync(`
            UPDATE events SET 
                content = ?
            WHERE id = ?
        `, [event.content, event.id])
    }

    static async listByCategory(category: TypeCategory, limit=100) : Promise<NDKEvent[]> {
        let db = await this.getDatabaseConnection()
        
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

    static async deleteByCondition(condition: string, args: any[]) : Promise<void> {
        let db = await this.getDatabaseConnection()
        await db.runAsync(`
            UPDATE events SET deleted = 1 WHERE ${condition};  
        `, args)
    }

    static async delete(id: string) : Promise<void> {
        let db = await this.getDatabaseConnection()
        await db.runAsync(`
            DELETE FROM events WHERE id = ?;  
        `, [id])
    }

    static async selecChats() : Promise<ChatUser[]> {
        let db = await this.getDatabaseConnection()
        let rows = await db.getAllAsync(`
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

    static async selecMessages(chat_id: string) : Promise<NDKEvent[]> {
        let db = await this.getDatabaseConnection()
        let rows = await db.getAllAsync(`
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

    static async clear() : Promise<void> {
        let db = await this.getDatabaseConnection()
        await db.execAsync("DELETE FROM events;")
    }
}

