import { 
    getUserName, 
    getClipedContent, 
    shortenString, 
    getDisplayPubkey, 
    replaceContentEvent, 
    getDescriptionTypeWallet, 
    extractVideoUrl, 
    getColorFromPubkey, 
    distinctBy 
} from './index'

import { useTranslate } from "../services/translate"
import { WalletType, User } from "@services/memory/types"
import theme from "../theme"
import { hexToNpub } from '../services/converter'

jest.mock("react-native", () => ({
    StyleSheet: {
        create: jest.fn()
    }
}))

jest.mock("@react-native-clipboard/clipboard", () => ({
    setString: jest.fn(),
}))

jest.mock("../services/notification", () => ({
    pushMessage: jest.fn(),
}))

jest.mock("../services/translate", () => ({
    useTranslate: jest.fn(),
}))

describe('Utility functions', () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('getUserName()', () => {
        it('should return the correct username', () => {
            const user: User = { display_name: 'John Doe', displayName: '', name: '', pubkey: '' }
            const result = getUserName(user)
            expect(result).toBe('John Doe')
        })

        it('should truncate username if it exceeds maxsize', () => {
            const user: User = { display_name: 'Johnathan Doe', displayName: '', name: '', pubkey: '' }
            const result = getUserName(user, 8)
            expect(result).toBe('Johnatha...')
        })

        it('should return empty string if no name fields are provided', () => {
            const user: User = { display_name: '', displayName: '', name: '', pubkey: '' }
            const result = getUserName(user)
            expect(result).toBe('')
        })
    })

    describe('getClipedContent()', () => {
        it('should return truncated content with "..." if it exceeds limit', () => {
            const content = 'This is a very long content string'
            const result = getClipedContent(content, 10)
            expect(result).toBe('This is a ...')
        })

        it('should return content as is if it does not exceed limit', () => {
            const content = 'Short content'
            const result = getClipedContent(content, 20)
            expect(result).toBe(content)
        })
    })

    describe('shortenString()', () => {
        it('should shorten string by splitting in the middle', () => {
            const result = shortenString("LongStringExample", 12)
            expect(result).toBe('LongSt...xample')
        })
    })

    describe('getDisplayPubkey()', () => {
        it('should return a shortened npub representation of the pubkey', () => {
            const pubkey = '2a3481b2052d8d4dd9380830cf4ef179bc50728e386a046ee637c10331bfb257'
            const result = getDisplayPubkey(pubkey)
            expect(result).toBe('npub19g6grvs99kx5mkf...c609h')
        })
    })

    describe('hexToNpub', () => {
        it('should convert pubkey to npub and copy to clipboard', async () => {
            const pubkey = '2a3481b2052d8d4dd9380830cf4ef179bc50728e386a046ee637c10331bfb257'
            const npub = 'npub19g6grvs99kx5mkfcpqcv7nh30x79qu5w8p4qgmhxxlqsxvdlkftscc609h'

            expect(hexToNpub(pubkey)).toBe(npub)
        })
    })

    describe('replaceContentEvent()', () => {
        it('should replace content correctly', () => {
            const content = "nostr:hello note https://example.com"
            const result = replaceContentEvent(content)

            expect(result).toBe("hello \nnote \n\nhttps://example.com")
        })
    })

    describe('getDescriptionTypeWallet()', () => {
        it('should return the correct wallet description based on type', async () => {
            (useTranslate as jest.Mock).mockResolvedValue('Testnet Wallet')

            const result = await getDescriptionTypeWallet("testnet" as WalletType)

            expect(result).toBe('Testnet Wallet')
            expect(useTranslate).toHaveBeenCalledWith("wallet.bitcoin.testnet.tag")
        })
    })

    describe('extractVideoUrl()', () => {
        it('should return the video URL if matched', () => {
            const content = "Check this video: https://example.com/video.mp4"
            const result = extractVideoUrl(content)

            expect(result).toBe('https://example.com/video.mp4')
        })

        it('should return null if no video URL is matched', () => {
            const content = "No video URL here"
            const result = extractVideoUrl(content)

            expect(result).toBeNull()
        })
    })

    describe('getColorFromPubkey()', () => {
        it('should return a color based on pubkey', () => {
            const pubkey = '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
            const result = getColorFromPubkey(pubkey)

            expect(result).toMatch(/^#[0-9a-fA-F]{6}$/) // Hex color format
        })

        it('should return default green if no pubkey is provided', () => {
            const result = getColorFromPubkey('')
            expect(result).toBe(theme.colors.green)
        })
    })

    describe('distinctBy()', () => {
        it('should filter out duplicates based on the key selector', () => {
            type I = { id: number, name: string }
            const items : I[] = [
                { id: 1, name: 'A' },
                { id: 2, name: 'B' },
                { id: 1, name: 'A' },
            ]

            const result = distinctBy<I>(item => item.id)(items)

            expect(result).toEqual([
                { id: 1, name: 'A' },
                { id: 2, name: 'B' },
            ])
        })
    })
})

