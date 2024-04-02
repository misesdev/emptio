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


