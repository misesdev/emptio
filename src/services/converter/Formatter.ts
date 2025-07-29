import { Currencies } from "./data/Currencies";
import { hexToBytes } from "@noble/curves/abstract/utils"
import { bech32 } from "bech32"

export class Formatter 
{
    private static _bitcoinParts: number = 100000000;

    public static formatMoney(value: number, currency: string = "USD", multiple: number = 100): string
    {
        const format = Currencies[currency] ?? "en-US"; 
        const formatter = new Intl.NumberFormat(format, {
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

    public static satsToBitcoin(satoshis: number): string 
    {
        const value = satoshis ? (satoshis / this._bitcoinParts).toFixed(8) : 0
        return value.toString()
    }

    public static bitcoinToSats(bitcoins: number): string 
    {
        const value = !!bitcoins ? (bitcoins * this._bitcoinParts).toFixed(0) : 0
        return value.toString().replace(/(.)(?=(\d{3})+$)/g, '$1.')
    }

    public static formatSats(satoshis: number): string 
    {
        return satoshis.toString().replace(/(.)(?=(\d{3})+$)/g, '$1.') 
    }

    public static textToNumber(text: string): number 
    {
        const number = text.replace(/[^0-9]/g, '')
        return parseInt(number)
    }

    public static pubkeyToNpub(pubkey: string): string 
    {
        const words = bech32.toWords(hexToBytes(pubkey))
        return bech32.encode("npub", words)
    }
}
