import AsyncStorage from '@react-native-async-storage/async-storage'
import { WalletStorage } from './index'
import { Wallet } from '../types'

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
}))

const mockWallets: Wallet[] = [
    {
        key: 'wallet1',
        name: 'My Wallet',
        type: 'bitcoin',
        lastBalance: 100,
        lastReceived: 50,
        lastSended: 20,
        address: 'bc1qxyz...',
        default: true,
        payfee: true,
        network: 'mainnet',
    },
]

describe('WalletStorage', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('list', () => {
        it('should return empty array if no data is stored', async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null)

            const result = await WalletStorage.list()
            expect(result).toEqual([])
            expect(AsyncStorage.getItem).toHaveBeenCalledWith('walletsdata')
        })

        it('should parse and return stored wallets', async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockWallets))

            const result = await WalletStorage.list()
            expect(result).toEqual(mockWallets)
        })
    })

    describe('add()', () => {
        it('should add a wallet to existing list', async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify([]))

            await WalletStorage.add(mockWallets[0])

            expect(AsyncStorage.setItem).toHaveBeenCalledWith(
                'walletsdata',
                JSON.stringify([mockWallets[0]])
            )
        })
    })

    describe('get', () => {
        it('should return the wallet if found', async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockWallets))

            const result = await WalletStorage.get('wallet1')
            expect(result).toEqual(mockWallets[0])
        })

        it('should throw if wallet is not found', async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockWallets))

            await expect(WalletStorage.get('unknown')).rejects.toThrow('wallet not found')
        })
    })

    describe('update', () => {
        it('should update the wallet and reset default flag if needed', async () => {
            const updated: Wallet = { ...mockWallets[0], name: 'Updated', default: true } as Wallet
            const another: Wallet = { ...mockWallets[0], key: 'wallet2', default: true } as Wallet

            (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
                JSON.stringify([mockWallets[0], another])
            )

            await WalletStorage.update(updated)

            const expected = [
                updated,
                { ...another, default: false },
            ]

            expect(AsyncStorage.setItem).toHaveBeenCalledWith(
                'walletsdata',
                JSON.stringify(expected)
            )
        })
    })

    describe('delete', () => {
        it('should remove wallet by key', async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockWallets))

            await WalletStorage.delete('wallet1')

            expect(AsyncStorage.setItem).toHaveBeenCalledWith(
                'walletsdata',
                JSON.stringify([])
            )
        })
    })

    describe('clear', () => {
        it('should remove walletsdata from storage', async () => {
            await WalletStorage.clear()
            expect(AsyncStorage.removeItem).toHaveBeenCalledWith('walletsdata')
        })
    })
})

