
const languages : { [key: string]: string } = {
  "USD": "en-US",
  "EUR": "de-DE",
  "BRL": "pt-BR",
  "GBP": "en-GB",
  "JPY": "ja-JP",
  "AUD": "en-AU",
  "CAD": "en-CA",
  "CHF": "de-CH",
  "CNY": "zh-CN",
  "INR": "hi-IN",
  "MXN": "es-MX",
  "RUB": "ru-RU",
  "ZAR": "en-ZA",
  "KRW": "ko-KR",
  "SEK": "sv-SE",
  "NOK": "nb-NO",
  "DKK": "da-DK",
  "PLN": "pl-PL",
  "TRY": "tr-TR",
  "ARS": "es-AR"
}


export const formatCurrency = (value: number, currency: string = "USD", multiple: number = 100) => {
    
    const language = languages[currency] ?? "en-US"; 

    const formatter = new Intl.NumberFormat(language, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
    })

    const parts = formatter.formatToParts(value / multiple);

    const symbol = parts.find(p => p.type === 'currency')?.value || '';
    const number = parts.filter(p => p.type !== 'currency').map(p => p.value).join('');

    // Force symbol before with space
    return `${symbol} ${number}`.trim();
}



