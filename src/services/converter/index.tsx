export const bitcoinParts = 100000000


export const toBitcoin = (bitcoinBalance: number | undefined) => {
    
    const value = !!bitcoinBalance ? bitcoinBalance.toFixed(8) : 0
    
    return value.toString()
}

export const toSats = (bitcoinBalance: number | undefined) => {

    const value = !!bitcoinBalance ? (bitcoinBalance * bitcoinParts).toFixed(0) : 0

    return value.toString().replace(/(.)(?=(\d{3})+$)/g, '$1.')
}


