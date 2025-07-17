import EncryptedStorage from "react-native-encrypted-storage"
import { BaseSecretStorage } from "./BaseSecretStorage";

const mockStorage: Record<string, string> = {}

jest.mock("react-native-encrypted-storage", () => ({
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

interface Credential {
    username: string;
    password: string;
}

class CredentialStorage extends BaseSecretStorage<Credential> {
    constructor() {
        super("credentials");
        this.notFoundMessage = "Credential not found";
    }
}

describe("BaseSecretStorage", () => {
    let storage: CredentialStorage;

    beforeEach(() => {
        storage = new CredentialStorage();
        for (let key in mockStorage) delete mockStorage[key];
        jest.clearAllMocks();
    });

    test("add(): should store a new credential with correct ID", async () => {
        const credential = { username: "john", password: "1234" };
        const stored = await storage.add(credential);

        expect(stored.id).toBe(0);
        expect(stored.entity).toEqual(credential);
        expect(EncryptedStorage.setItem).toHaveBeenCalled();
    });

    test("get(): should return credential by ID", async () => {
        const data = { username: "john", password: "1234" };
        await storage.add(data);

        const result = await storage.get(0);
        expect(result).toEqual(data);
    });

    test("get(): should throw error if not found", async () => {
        await expect(storage.get(123)).rejects.toThrow("Credential not found");
    });

    test("list(): should return all credentials", async () => {
        await storage.add({ username: "user1", password: "pw1" });
        await storage.add({ username: "user2", password: "pw2" });

        const list = await storage.list();
        expect(list.length).toBe(2);
        expect(list[1].entity.username).toBe("user2");
    });

    test("update(): should update existing credential", async () => {
        await storage.add({ username: "john", password: "1234" });

        await storage.update(0, { username: "john", password: "4321" });

        const updated = await storage.get(0);
        expect(updated.password).toBe("4321");
    });

    test("update(): should throw error if ID not found", async () => {
        await expect(
            storage.update(999, { username: "ghost", password: "secret" })
        ).rejects.toThrow("Credential not found");
    });

    test("remove(): should delete credential by ID", async () => {
        await storage.add({ username: "john", password: "1234" });

        await storage.remove(0);

        const list = await storage.list();
        expect(list).toEqual([]);
    });

    test("list(): should return empty array if no data", async () => {
        const list = await storage.list();
        expect(list).toEqual([]);
    });
});
