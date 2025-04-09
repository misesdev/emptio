import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserStorage } from "./index";
import { User } from "../types";

// Mock of AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
}));

describe("UserStorage", () => {
    const mockUser: User = {
        name: "John Doe"
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("get", () => {
        it("should return a user when it exists in AsyncStorage", async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockUser));
            const result = await UserStorage.get();
            expect(result).toEqual(mockUser);
            expect(AsyncStorage.getItem).toHaveBeenCalledWith("userdata");
        });

        it("should return an empty object when there is no data", async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
            const result = await UserStorage.get();
            expect(result).toEqual({});
            expect(AsyncStorage.getItem).toHaveBeenCalledWith("userdata");
        });
    });

    describe("save", () => {
        it("should save user in AsyncStorage", async () => {
            await UserStorage.save(mockUser);
            expect(AsyncStorage.setItem).toHaveBeenCalledWith(
                "userdata",
                JSON.stringify(mockUser)
            );
        });
    });

    describe("delete", () => {
        it("must remove user from AsyncStorage", async () => {
            await UserStorage.delete();
            expect(AsyncStorage.removeItem).toHaveBeenCalledWith("userdata");
        });
    });
});
