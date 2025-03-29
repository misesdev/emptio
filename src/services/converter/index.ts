import { hexToBytes } from "@noble/curves/abstract/utils"
import { bech32 } from "bech32"

export const bitcoinParts = 100000000

export const toBitcoin = (bitcoinBalance: number | undefined) => {
    
    const value = bitcoinBalance ? (bitcoinBalance / bitcoinParts).toFixed(8) : 0
    
    return value.toString()
}

export const toSats = (bitcoinBalance: number | undefined) => {

    const value = !!bitcoinBalance ? (bitcoinBalance * bitcoinParts).toFixed(0) : 0

    return value.toString().replace(/(.)(?=(\d{3})+$)/g, '$1.')
}

export const formatSats = (satoshis?: number) : string => {

    const value = satoshis? satoshis.toString().replace(/(.)(?=(\d{3})+$)/g, '$1.') : "0"

    return value
}

export const toNumber = (text: string) => {
    const number = text.replace(/[^0-9]/g, '')

    return parseInt(number)
}

export const hexToNpub = (pubkey: string) => {
    const words = bech32.toWords(hexToBytes(pubkey))
    return bech32.encode("npub", words)
}

export const timeSeconds = {
    minute: 60,
    hour: 3600,
    day: 86400,
    week: 604800,
    without: (days: number) => {
        return Math.floor(Date.now() / 1000) - (days * timeSeconds.day)
    },
    now: () => Math.floor(Date.now() / 1000),
    toString: (timestamp: number) => {
        let date = new Date(timestamp * 1000)
        // let now = Math.floor(Date.now() / 1000)

        return date.toLocaleString()
        // const now = Math.floor(Date.now() / 1000);
        // const diff = now - timestamp;
        // const date = new Date(timestamp * 1000);
        // 
        // if (diff < timeSeconds.day) { // Menos de um dia
        //     const hours = date.getHours().toString().padStart(2, '0');
        //     const minutes = date.getMinutes().toString().padStart(2, '0');
        //     return diff < 43200 ? `Hoje às ${hours}:${minutes}` : `Ontem às ${hours}:${minutes}`;
        // }
        // 
        // const days = Math.floor(diff / 86400);
        // if (days === 1) return 'Ontem';
        // if (days < 7) return `Há ${days} dias`;
        // if (days < 14) return 'Há uma semana';
        // if (days < 30) return `Há ${Math.floor(days / 7)} semanas`;
        // if (days < 365) return days < 60 ? 'Há um mês' : `Há ${Math.floor(days / 30)} meses`;
        // 
        // return days < 730 ? 'Há um ano' : `Há ${Math.floor(days / 365)} anos`;
    }
}
