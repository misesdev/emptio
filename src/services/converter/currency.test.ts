import { formatCurrency } from "./currency"

describe("currency functions", () => {
    test("format currency", () => {
        let value = 12345
        let result = formatCurrency(value)
        expect(result).toBe("$ 123.45")
        
        // result = formatCurrency(value, "BRL")
        // expect(result).toBe("R$ 123,45")
    })
})
