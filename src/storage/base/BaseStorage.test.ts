import AsyncStorage from "@react-native-async-storage/async-storage";
import { BaseStorage } from "./BaseStorage"

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

interface Movie {
    name: string,
    description: string
}

class MovieStorage extends BaseStorage<Movie> {
    constructor() {
        super("movies")
        super.notFoundMessage = "Movie not found"
    }
}

describe("BaseStorage", () => {
    let storage: MovieStorage;

    beforeEach(() => {
        storage = new MovieStorage();
        for (let key in mockStorage) delete mockStorage[key];
        jest.clearAllMocks();
    });

    test("add(): should add a movie and assign an ID", async () => {
        const movie = { name: "Inception", description: "Dream within a dream" };
        const stored = await storage.add(movie);

        expect(stored.id).toBe(0);
        expect(stored.entity).toEqual(movie);
        expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    test("get(): should retrieve a movie by ID", async () => {
        const movie = { name: "Interstellar", description: "Space and time" };
        await storage.add(movie);

        const fetched = await storage.get(0);
        expect(fetched).toEqual(movie);
    });

    test("get(): should throw if movie not found", async () => {
        await expect(storage.get(999)).rejects.toThrow("Movie not found");
    });

    test("list(): should return all movies", async () => {
        const m1 = { name: "Tenet", description: "Time inversion" };
        const m2 = { name: "Dunkirk", description: "War story" };
        await storage.add(m1);
        await storage.add(m2);

        const list = await storage.list();
        expect(list.length).toBe(2);
        expect(list[1].entity).toEqual(m2);
    });

    test("list(): should return empty list if nothing saved", async () => {
        const list = await storage.list();
        expect(list).toEqual([]);
    });

    test("update(): should update a movie by ID", async () => {
        const original = { name: "Memento", description: "Short memory" };
        const updated = { name: "Memento", description: "Updated description" };
        await storage.add(original);

        await storage.update(0, updated);
        const list = await storage.list();
        expect(list[0].entity).toEqual(updated);
    });

    test("update(): should throw if movie not found", async () => {
        const movie = { name: "Nowhere", description: "Nonexistent" };
        await expect(storage.update(99, movie)).rejects.toThrow("Movie not found");
    });

    test("remove(): should remove a movie by ID", async () => {
        const movie = { name: "Prestige", description: "Magicians" };
        await storage.add(movie);

        await storage.remove(0);

        const list = await storage.list();
        expect(list).toEqual([]);
    });

    test("remove(): should not throw if ID doesn't exist", async () => {
        const movie = { name: "Batman", description: "Dark Knight" };
        await storage.add(movie);

        await expect(storage.remove(99)).resolves.not.toThrow();
    });
});
