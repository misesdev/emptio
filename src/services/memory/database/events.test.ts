import { DBEvents, dbEventProps } from './events';
import { NDKEvent } from '@nostr-dev-kit/ndk';

jest.mock('expo-sqlite', () => {
    const runAsync = jest.fn();
    const getAllAsync = jest.fn();
    const execAsync = jest.fn();
    const openDatabaseAsync = jest.fn(() => Promise.resolve({
        runAsync,
        getAllAsync,
        execAsync
    }));
    return {
        openDatabaseAsync,
        runAsync,
        getAllAsync,
        execAsync
    };
});

import * as SQLite from 'expo-sqlite';

const mockDb = {
    runAsync: jest.fn(),
    getAllAsync: jest.fn(),
    execAsync: jest.fn()
};

beforeEach(() => {
    (SQLite.openDatabaseAsync as jest.Mock).mockResolvedValue(mockDb);
    jest.clearAllMocks();
});

const mockEvent: NDKEvent = {
    id: '1',
    kind: 1,
    pubkey: 'abc',
    content: 'test content',
    sig: 'signature',
    tags: [['t', 'tag']],
    created_at: 1234567890
} as NDKEvent;

describe('DBEvents', () => {
    it('should initialize the database', async () => {
        await DBEvents.initDatabase();
        expect(mockDb.execAsync).toHaveBeenCalled();
    });

    it('should insert a single event', async () => {
        mockDb.runAsync.mockResolvedValue({ changes: 1 });

        const inserted = await DBEvents.insert({ event: mockEvent, category: 'feed' });
        expect(inserted).toBe(true);
        expect(mockDb.runAsync).toHaveBeenCalled();
    });

    it('should not insert duplicate event', async () => {
        mockDb.runAsync.mockResolvedValue({ changes: 0 });

        const inserted = await DBEvents.insert({ event: mockEvent, category: 'feed' });
        expect(inserted).toBe(false);
    });

    it('should insert a batch of new events', async () => {
        const events: dbEventProps[] = [
            { event: { ...mockEvent, id: '1' } as NDKEvent, category: 'feed' },
            { event: { ...mockEvent, id: '2' } as NDKEvent, category: 'feed' }
        ];

        mockDb.getAllAsync.mockResolvedValue([{ id: '1' }]); // id 1 já existe
        mockDb.runAsync.mockResolvedValue({});

        const result = await DBEvents.insertInBatch(events);
        expect(result).toHaveLength(1); // apenas o ID 2 foi inserido
        expect(result[0].event.id).toBe('2');
    });

    it('should update event content', async () => {
        await DBEvents.updateContent(mockEvent);
        expect(mockDb.runAsync).toHaveBeenCalledWith(expect.stringContaining('UPDATE events SET'), [mockEvent.content, mockEvent.id]);
    });

    it('should list events by category', async () => {
        mockDb.getAllAsync.mockResolvedValue([
            {
                id: '1',
                kind: 1,
                pubkey: 'abc',
                content: 'test',
                sig: 'sig',
                tags: '[["t","tag"]]',
                created_at: 123456
            }
        ]);

        const results = await DBEvents.listByCategory('feed');
        expect(results[0].id).toBe('1');
    });

    it('should delete event by ID', async () => {
        await DBEvents.delete('1');
        expect(mockDb.runAsync).toHaveBeenCalledWith(expect.any(String), ['1']);
    });

    it('should call deleteEventsByCondition', async () => {
        await DBEvents.deleteByCondition('category = ?', ['feed']);
        expect(mockDb.runAsync).toHaveBeenCalledWith(expect.stringContaining('UPDATE events SET deleted = 1'), ['feed']);
    });

    it('should return chat message previews', async () => {
        mockDb.getAllAsync.mockResolvedValue([
            {
                chat_id: 'chat1',
                id: '1',
                kind: 1,
                pubkey: 'abc',
                content: 'msg',
                sig: 'sig',
                tags: '[["t","x"]]',
                created_at: 1111,
                unreadCount: 5
            }
        ]);

        const chats = await DBEvents.selecChats();
        expect(chats[0].chat_id).toBe('chat1');
        expect(chats[0].unreadCount).toBe(5);
        expect(chats[0].lastMessage.content).toBe('msg');
    });

    it('should select messages and update status to viewed', async () => {
        mockDb.getAllAsync.mockResolvedValue([
            {
                id: '1',
                kind: 1,
                pubkey: 'abc',
                content: 'viewed msg',
                sig: 'sig',
                tags: '[["t","x"]]',
                created_at: 1111,
            }
        ]);

        const messages = await DBEvents.selecMessages('chat1');
        expect(messages).toHaveLength(1);
        expect(messages[0].content).toBe('viewed msg');
    });

    it('should clear events table', async () => {
        await DBEvents.clear();
        expect(mockDb.execAsync).toHaveBeenCalledWith('DELETE FROM events;');
    });
});

