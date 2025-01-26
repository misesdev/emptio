import { secp256k1 } from "@noble/curves/secp256k1"

export const signHex = (txHex: string, privKeyHex: string): string => {

    const signature = secp256k1.sign(txHex, privKeyHex)

    return signature.toDERHex() //transaction
}

export const signBuffer = (txHash: Buffer, privKeyHex: string, lowR?: boolean): Buffer => {

    const signature = secp256k1.sign(txHash, privKeyHex, { lowS: lowR }).toDERHex()

    return Buffer.from(signature, "hex")
}

export const verifySign = (pubkey: Buffer, msghash: Buffer, signature: Buffer) => secp256k1.verify(signature.toString('hex'), pubkey.toString('hex'), msghash.toString('hex'))

export const signOutPut = (signHash: Buffer, privateKey: string) => {

    const signature = secp256k1.sign(signHash, privateKey)

    return Buffer.from(signature.toCompactHex(), "hex")
}

export const getRandomKey = (length: number): string => {

    var hash = ""
    const characters = []
    // Adicionando letras maiúsculas
    for (let i = 65; i <= 90; i++)
        characters.push(String.fromCharCode(i))

    // Adicionando letras minúsculas
    for (let i = 97; i <= 122; i++)
        characters.push(String.fromCharCode(i))

    // Adicionando números
    for (let i = 0; i <= 9; i++)
        characters.push(i.toString())

    for (let i = 0; i <= length; i++)
        hash += characters[parseInt((Math.random() * characters.length).toFixed(0))]

    return hash
}
