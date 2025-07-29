import { TimeSeconds } from "./TimeSeconds";

// Freeze time at a fixed reference point
const mockNow = new Date("2022-05-13T12:32:00Z").getTime() / 1000;

jest.spyOn(TimeSeconds, "now").mockImplementation(() => mockNow);

describe("TimeSeconds", () => {
    describe("toString", () => {
        test("returns 'now' for less than 60 seconds ago", () => {
            const ts = mockNow - 30;
            expect(TimeSeconds.toString(ts)).toBe("now 9:31");
        })

        test("returns 'today' if timestamp is earlier today", () => {
            const earlierToday = new Date("2022-05-13T11:30:00Z").getTime() / 1000;
            expect(TimeSeconds.toString(earlierToday)).toBe("today 8:30");
        })

        test("returns 'yesterday' if timestamp is from yesterday", () => {
            const yesterday = new Date("2022-05-12T14:00:00Z").getTime() / 1000;
            expect(TimeSeconds.toString(yesterday)).toBe("yesterday 11:00");
        })

        test("formats older dates as dd/MM/yyyy HH:mm", () => {
            const oldDate = new Date("2022-05-10T08:32:00Z").getTime() / 1000;
            const result = TimeSeconds.toString(oldDate);
            expect(result).toBe("10/05/2022 05:32");
        })
    })
})

