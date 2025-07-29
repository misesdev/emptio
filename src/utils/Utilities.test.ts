import { Utilities } from "./Utilities";
import Clipboard from "@react-native-clipboard/clipboard";
import { Formatter } from "../services/converter/Formatter";
import theme from "../theme";

// Mocks
jest.mock("@react-native-clipboard/clipboard", () => ({
    setString: jest.fn()
}));

jest.mock("../services/translate/TranslateService", () => ({
    useTranslate: jest.fn().mockImplementation((key) => Promise.resolve(`translated: ${key}`))
}));

jest.mock("../services/notification", () => ({
    pushMessage: jest.fn()
}));

jest.mock("../services/converter/Formatter", () => ({
    Formatter: {
        pubkeyToNpub: jest.fn((pubkey) => `npub_${pubkey}`)
    }
}));

describe("Utilities", () => {
    describe("pubkeyFromTags", () => {
        it("extracts pubkeys from 'p' tags", () => {
            const event = {
                tags: [["p", "pubkey1"], ["e", "event"], ["p", "pubkey2"]]
            } as any;
            expect(Utilities.pubkeyFromTags(event)).toEqual(["pubkey1", "pubkey2"]);
        });
    });

    describe("orderEvents", () => {
        it("orders events descending by created_at", () => {
            const result = Utilities.orderEvents([
                { created_at: 2 } as any,
                { created_at: 5 } as any,
                { created_at: 1 } as any
            ]);
            expect(result.map(e => e.created_at)).toEqual([5, 2, 1]);
        });

        it("handles missing created_at with fallback", () => {
            const result = Utilities.orderEvents([
                { created_at: undefined } as any,
                { created_at: 5 } as any
            ]);
            expect(result[0].created_at).toBe(5);
        });
    });

    describe("orderChats", () => {
        it("orders ChatUser objects by lastMessage.created_at", () => {
            const result = Utilities.orderChats([
                { lastMessage: { created_at: 2 } } as any,
                { lastMessage: { created_at: 5 } } as any,
                { lastMessage: {} } as any
            ]);
            expect(result[0].lastMessage.created_at).toBe(5);
        });
    });

    describe("getUserName", () => {
        it("returns truncated display name if too long", () => {
            const user = { display_name: "averylongusernamethatexceeds" } as any;
            expect(Utilities.getUserName(user, 10)).toBe("averylongu...");
        });

        it("returns fallback properties in order", () => {
            const user = { displayName: "Display", name: "Name", pubkey: "Pubkey" } as any;
            expect(Utilities.getUserName(user)).toBe("Display");
        });

        it("returns empty string if nothing defined", () => {
            expect(Utilities.getUserName({} as any)).toBe("");
        });
    });

    describe("copyToClipboard", () => {
        it("copies to clipboard and pushes translated message", async () => {
            await Utilities.copyToClipboard("hello");
            expect(Clipboard.setString).toHaveBeenCalledWith("hello");
        });
    });

    describe("getClipedContent", () => {
        it("returns trimmed content with ellipsis", () => {
            const result = Utilities.getClipedContent("a".repeat(100), 50);
            expect(result).toBe("a".repeat(50) + "...");
        });

        it("returns full content if within limit", () => {
            const result = Utilities.getClipedContent("short", 50);
            expect(result).toBe("short");
        });
    });

    describe("shortenString", () => {
        it("returns shortened string with middle ellipsis", () => {
            const result = Utilities.shortenString("1234567890", 4);
            expect(result).toBe("12...90");
        });
    });

    describe("copyPubkey", () => {
        it("converts pubkey to npub and copies", async () => {
            await Utilities.copyPubkey("abc123");
            expect(Formatter.pubkeyToNpub).toHaveBeenCalledWith("abc123");
            expect(Clipboard.setString).toHaveBeenCalledWith("npub_abc123");
        });
    });

    describe("getDisplayPubkey", () => {
        it("returns shortened npub representation", () => {
            const result = Utilities.getDisplayPubkey("abc123", 10);
            expect(result).toBe("npub_...bc123");
        });
    });

    describe("replaceContentEvent", () => {
        it("applies all content replacements", () => {
            const input = "nostr:note123 [label](https://url.com) https://site.com nevent456 https://link.com";
            const result = Utilities.replaceContentEvent(input);
            expect(result).toContain("note");
            expect(result).toContain("nevent");
            expect(result).toContain("https");
            expect(result).toContain("label\n\nhttps://url.com");
        });
    });

    describe("getDescriptionTypeWallet", () => {
        it("returns translated tag for testnet", async () => {
            const result = await Utilities.getDescriptionTypeWallet("testnet");
            expect(result).toBe("translated: wallet.bitcoin.testnet.tag");
        });

        it("returns translated tag for mainnet", async () => {
            const result = await Utilities.getDescriptionTypeWallet("mainnet");
            expect(result).toBe("translated: wallet.bitcoin.tag");
        });
    });

    describe("extractVideoUrl", () => {
        it("extracts video url if present", () => {
            const result = Utilities.extractVideoUrl("Check this video https://host.com/video.mp4");
            expect(result).toBe("https://host.com/video.mp4");
        });

        it("returns null if no match", () => {
            const result = Utilities.extractVideoUrl("Just some text");
            expect(result).toBeNull();
        });
    });

    describe("getColorFromPubkey", () => {
        it("returns default color if pubkey is empty", () => {
            expect(Utilities.getColorFromPubkey("")).toBe(theme.colors.green);
        });

        it("generates a consistent color for a pubkey", () => {
            const color1 = Utilities.getColorFromPubkey("abc");
            const color2 = Utilities.getColorFromPubkey("abc");
            expect(color1).toBe(color2);
        });
    });

    describe("distinctBy", () => {
        it("filters duplicates based on key selector", () => {
            type Item = { id: number, name: string };
            const list: Item[] = [
                { id: 1, name: "a" },
                { id: 2, name: "b" },
                { id: 1, name: "c" }
            ];
            const distinct = Utilities.distinctBy<Item>((x) => x.id)(list);
            expect(distinct).toEqual([
                { id: 1, name: "a" },
                { id: 2, name: "b" }
            ]);
        });
    });
});

