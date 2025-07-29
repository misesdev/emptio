import { Formatter } from "./Formatter";
import { bech32 } from "bech32";

// Mock the Currencies module
jest.mock("./data/Currencies", () => ({
    Currencies: {
        USD: "en-US",
        EUR: "de-DE",
        BRL: "pt-BR"
    }
}));

describe("Formatter", () => {
    describe("formatMoney", () => {
        it("formats value in USD by default", () => {
            const result = Formatter.formatMoney(123456, "USD");
            expect(result).toMatch(/^\$\s*1,234\.56$/);
        });

        it("formats value in BRL", () => {
            const result = Formatter.formatMoney(123456, "BRL");
            expect(result).toMatch(/^R\$\s*1\.234,56$/);
        });

        it("formats value in EUR", () => {
            const result = Formatter.formatMoney(123456, "EUR");
            expect(result).toMatch(/[\s€]*1\.234,56|1\.234,56\s*€/);
        });

        it("defaults to 'en-US' locale when currency is unknown", () => {
            const result = Formatter.formatMoney(1000);
            expect(result).toMatch(/^\$\s*10\.00$/);
        });

        it("uses custom multiplier correctly", () => {
            const result = Formatter.formatMoney(1234, "USD", 1);
            expect(result).toMatch(/^\$\s*1,234\.00$/);
        });
    });

    describe("satsToBitcoin", () => {
        it("converts satoshis to bitcoins correctly", () => {
            expect(Formatter.satsToBitcoin(100000000)).toBe("1.00000000");
            expect(Formatter.satsToBitcoin(123456789)).toBe("1.23456789");
        });

        it("returns 0 when value is 0", () => {
            expect(Formatter.satsToBitcoin(0)).toBe("0");
        });
    });

    describe("bitcoinToSats", () => {
        it("converts bitcoins to satoshis with thousand separators", () => {
            expect(Formatter.bitcoinToSats(1)).toBe("100.000.000");
            expect(Formatter.bitcoinToSats(0.5)).toBe("50.000.000");
        });

        it("returns 0 when value is 0", () => {
            expect(Formatter.bitcoinToSats(0)).toBe("0");
        });
    });

    describe("formatSats", () => {
        it("formats satoshis with thousand separators", () => {
            expect(Formatter.formatSats(1000)).toBe("1.000");
            expect(Formatter.formatSats(123456789)).toBe("123.456.789");
        });

        it("formats 0 correctly", () => {
            expect(Formatter.formatSats(0)).toBe("0");
        });
    });

    describe("textToNumber", () => {
        it("extracts digits from formatted strings", () => {
            expect(Formatter.textToNumber("R$ 1.234,56")).toBe(123456);
            expect(Formatter.textToNumber("$1,000.00")).toBe(100000);
        });

        it("returns NaN for non-numeric strings", () => {
            expect(Formatter.textToNumber("not a number")).toBeNaN();
        });

        it("parses numeric-only strings correctly", () => {
            expect(Formatter.textToNumber("123456")).toBe(123456);
        });
    });

    describe("pubkeyToNpub", () => {
        it("encodes a valid hex pubkey as npub (bech32)", () => {
            const pubkey = "f".repeat(64); // 32-byte hex
            const npub = Formatter.pubkeyToNpub(pubkey);
            expect(npub.startsWith("npub1")).toBe(true);

            const decoded = bech32.decode(npub);
            expect(decoded.prefix).toBe("npub");
        });

        it("throws if pubkey is invalid hex", () => {
            expect(() => Formatter.pubkeyToNpub("123")).toThrow();
        });
    });
});
