import { renderHook, act } from "@testing-library/react-hooks"
import { useWallet } from "./use-wallet"
import { walletService } from "@services/wallet"
import { storageService } from "@services/memory"
import { Transaction, Wallet, WalletInfo } from "@services/memory/types"

const flushPromises = () => new Promise(setImmediate)

const mockWallet = {
    key: "wallet1",
    name: "Main Wallet",
    lastBalance: 0,
    lastReceived: 0,
    lastSended: 0
} as Wallet

const navigation = {
    navigate: jest.fn()
}

const route = {
    params: {
        wallet: mockWallet
    }
}

describe("useWallet", () => {
    beforeEach(() => {
        jest.clearAllMocks()
        //jest.useFakeTimers()
    })

    // afterEach(() => {
    //     jest.useRealTimers()
    // })
    it("should initialize and load transactions", async () => {
        const mockResult : WalletInfo = {
            balance: 100,
            received: 200,
            sended: 100,
            transactions: [
                { txid: "tx1", amount: 100 },
                { txid: "tx2", amount: 50 }
            ]
        }

        ;(walletService.listTransactions as jest.Mock).mockResolvedValue(mockResult)

        const { result } = renderHook(() => useWallet({ navigation, route }))

        await act(async () => {
            jest.runAllTimers()
            await flushPromises()
        })
               
        expect(walletService.listTransactions).toHaveBeenCalledWith(mockWallet)
        expect(result.current.transactions).toEqual(mockResult.transactions)
        expect(result.current.wallet.lastBalance).toBe(100)
        expect(result.current.wallet.lastReceived).toBe(200)
        expect(result.current.wallet.lastSended).toBe(100)
        expect(result.current.refreshing).toBe(false)

        expect(storageService.wallets.update).toHaveBeenCalledWith(expect.objectContaining({
            key: "wallet1",
            lastBalance: 100
        }))
    })

    it("should not update wallet if balance is the same", async () => {
        const mockResult : WalletInfo = {
            balance: 0,
            received: 0,
            sended: 0,
            transactions: []
        }

        ;(walletService.listTransactions as jest.Mock).mockResolvedValue(mockResult)

        const { result } = renderHook(() => useWallet({ navigation, route }))

        await act(async () => {
            jest.runAllTimers()
            await flushPromises()
        })

        expect(storageService.wallets.update).not.toHaveBeenCalled()
        expect(result.current.refreshing).toBe(false)
    })

    it("should call navigation.navigate on showOptions", () => {
        const { result } = renderHook(() => useWallet({ navigation, route }))

        act(() => {
            result.current.showOptions()
        })

        expect(navigation.navigate).toHaveBeenCalledWith("wallet-settings-stack", {
            wallet: mockWallet
        })
    })

    it("should call navigation.navigate on openTransaction", () => {
        const { result } = renderHook(() => useWallet({ navigation, route }))

        const tx = { txid: "tx1", amount: 50 } as Transaction

        act(() => {
            result.current.openTransaction(tx)
        })

        expect(navigation.navigate).toHaveBeenCalledWith("wallet-transaction-stack", {
            wallet: mockWallet,
            transaction: tx
        })
    })
})

