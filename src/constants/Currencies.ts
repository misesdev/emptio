export interface Currency {
    code: string,
    label: string,
    symbol: string,
    flag: string
}

const Currencies: Currency[] = [
  { code: "USD", label: "currency.label.usd", symbol: "$", flag: "🇺🇸" }, // US Dollar
  { code: "EUR", label: "currency.label.eur", symbol: "€", flag: "🇪🇺" }, // Euro
  { code: "BRL", label: "currency.label.brl", symbol: "R$", flag: "🇧🇷" }, // Brazilian Real
  { code: "GBP", label: "currency.label.gbp", symbol: "£", flag: "🇬🇧" }, // British Pound
  { code: "JPY", label: "currency.label.jpy", symbol: "¥", flag: "🇯🇵" }, // Japanese Yen
  { code: "AUD", label: "currency.label.aud", symbol: "A$", flag: "🇦🇺" }, // Australian Dollar
  { code: "CAD", label: "currency.label.cad", symbol: "C$", flag: "🇨🇦" }, // Canadian Dollar
  { code: "CHF", label: "currency.label.chf", symbol: "CHF", flag: "🇨🇭" }, // Swiss Franc
  { code: "CNY", label: "currency.label.cny", symbol: "¥", flag: "🇨🇳" }, // Chinese Yuan
  { code: "INR", label: "currency.label.inr", symbol: "₹", flag: "🇮🇳" }, // Indian Rupee
  { code: "MXN", label: "currency.label.mxn", symbol: "$", flag: "🇲🇽" }, // Mexican Peso
  { code: "RUB", label: "currency.label.rub", symbol: "₽", flag: "🇷🇺" }, // Russian Ruble
  { code: "ZAR", label: "currency.label.zar", symbol: "R", flag: "🇿🇦" }, // South African Rand
  { code: "KRW", label: "currency.label.krw", symbol: "₩", flag: "🇰🇷" }, // South Korean Won
  { code: "SEK", label: "currency.label.sek", symbol: "kr", flag: "🇸🇪" }, // Swedish Krona
  { code: "NOK", label: "currency.label.nok", symbol: "kr", flag: "🇳🇴" }, // Norwegian Krone
  { code: "DKK", label: "currency.label.dkk", symbol: "kr", flag: "🇩🇰" }, // Danish Krone
  { code: "PLN", label: "currency.label.pln", symbol: "zł", flag: "🇵🇱" }, // Polish Zloty
  { code: "TRY", label: "currency.label.try", symbol: "₺", flag: "🇹🇷" }, // Turkish Lira
  { code: "ARS", label: "currency.label.ars", symbol: "$", flag: "🇦🇷" }, // Argentine Peso
]

export default Currencies;

