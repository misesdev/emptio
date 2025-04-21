import { timeSeconds } from "../converter"

export const getRandomKey = (length: number = 15): string => {

    var hash = ""
    const timestamp = timeSeconds.now().toFixed(0)
    const characters = "qwertyuiopasdfghjklzxcvbnm1234567890QWERTYUIOPASDFGHJKLZXCVBNM"

    hash += timestamp.substring(timestamp.length/2)

    while (hash.length < length) {
        const randomIndex = Math.floor(Math.random() * characters.length)
        hash += characters[randomIndex]
    }

    return hash.slice(0, length)
}



