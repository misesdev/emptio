import AsyncStorage from "@react-native-async-storage/async-storage";
import { ItemStorage } from "./ItemStorage";

const mockStorage: Record<string, string> = {}

jest.mock("@react-native-async-storage/async-storage", () => ({
    setItem: jest.fn(async (key: string, value: string) => {
        mockStorage[key] = value;
    }),
    getItem: jest.fn(async (key: string) => {
        return mockStorage[key] || null;
    }),
    removeItem: jest.fn(async (key: string) => {
        delete mockStorage[key];
    }),
}))

interface Session {
    token: string;
    expires: number;
}

class SessionStorage extends ItemStorage<Session> {
    constructor(defaultEntity: Session | null = null) {
        super("session", defaultEntity);
    }
}

describe("ItemStorage", () => {
    let storage: SessionStorage;
    const key = "session";

    beforeEach(() => {
        storage = new SessionStorage();
        for (let k in mockStorage) delete mockStorage[k];
        jest.clearAllMocks();
    });

    test("get() should return stored value", async () => {
        const value = { token: "abc", expires: 999 };
        await AsyncStorage.setItem(key, JSON.stringify(value));

        const result = await storage.get();
        expect(result).toEqual(value);
    });

    test("get() should return default if no data is stored", async () => {
        storage = new SessionStorage({ token: "default", expires: 0 });

        const result = await storage.get();
        expect(result).toEqual({ token: "default", expires: 0 });
    });

    test("get() should return default if stored value is invalid JSON", async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce("INVALID_JSON");
        storage = new SessionStorage({ token: "fallback", expires: -1 });

        const result = await storage.get();
        expect(result).toEqual({ token: "fallback", expires: -1 });
    });

    test("set() should store value", async () => {
        const value = { token: "new-token", expires: 123 };
        await storage.set(value);

        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
            key,
            JSON.stringify(value)
        );

        const raw = await AsyncStorage.getItem(key);
        expect(JSON.parse(raw!)).toEqual(value);
    });

    test("setDefaultEntity() should change default value used in get()", async () => {
        storage.setDefaultEntity({ token: "changed", expires: 5 });

        const result = await storage.get();
        expect(result).toEqual({ token: "changed", expires: 5 });
    });

    test("clear() should remove the stored value", async () => {
        const value = { token: "remove-me", expires: 42 };
        await storage.set(value);

        await storage.clear();

        expect(AsyncStorage.removeItem).toHaveBeenCalledWith(key);
        expect(await AsyncStorage.getItem(key)).toBeNull();
    });
});
