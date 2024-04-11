import { formatSats, toBitcoin, toNumber, toSats } from "@/src/services/converter"


describe("Converters functions", () => {
    it("Number to bitcoin amount", () => {
        const bitcoins = toBitcoin(19999)

        expect(bitcoins.length).toEqual(10)
        expect(bitcoins).toBe("0.00019999")
    })
    it("Bitcoin number to sats amount", () => {
        const satoshis = toSats(0.00343444)

        expect(satoshis.length).toEqual(7)
        expect(satoshis).toBe("343.444")
    })
    it("Format number to sats formated money", () => {
        const sats = formatSats(69905544)

        expect(sats.length).toEqual(10)
        expect(sats).toBe("69.905.544")
    })
    it("Convert sats string to number", () => {
        const satoshis = toNumber("1.999")

        expect(satoshis).toBe(1999)
    })
})
