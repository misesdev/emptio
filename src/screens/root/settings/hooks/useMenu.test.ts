import { renderHook, act } from '@testing-library/react-native'
import { showMessage } from '@components/general/MessageBox'
import { pushMessage } from '@services/notification'
import useMenu from './useMenu'

// Mocks diretos
jest.mock('react-native-device-info', () => ({
    getVersion: () => '1.2.3',
}))

const copyToClipboard = jest.fn()
jest.mock('@src/utils', () => ({
    copyToClipboard: (...args: any[]) => copyToClipboard(...args),
}))

jest.mock('nostr-tools', () => ({
    nip19: {
        npubEncode: (pub: string) => `npub-${pub}`,
        nsecEncode: (priv: any) => `nsec-${priv}`,
    },
}))

jest.mock('bitcoin-tx-lib', () => ({
    hexToBytes: (hex: string) => `bytes-of-${hex}`,
}))

describe('useMenu', () => {
    const navigation = { reset: jest.fn() }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('boots correctly', () => {
        const { result } = renderHook(() => useMenu({ navigation }))

        expect(result.current.appVersion).toBe('1.2.3')
        expect(result.current.poolstats.connected).toBe(2)
        expect(result.current.poolstats.total).toBe(3)
    })

    it('copy public key', async () => {
        ;(storageService.secrets.getPairKey as jest.Mock)
            .mockResolvedValueOnce({ publicKey: 'pub123' })

        const { result } = renderHook(() => useMenu({ navigation }))
        await act(() => result.current.copyPublicKey())

        expect(copyToClipboard).toHaveBeenCalledWith('npub-pub123')
    })

    it('copy secret key if biometrics are OK', async () => {
        
        ;(authService.checkBiometric as jest.Mock).mockResolvedValueOnce(true)
        ;(storageService.secrets.getPairKey as jest.Mock)
            .mockResolvedValueOnce({ privateKey: 'deadbeef' })

        const { result } = renderHook(() => useMenu({ navigation }))
        await act(() => result.current.copySecretKey())

        expect(copyToClipboard).toHaveBeenCalledWith('nsec-bytes-of-deadbeef')
    })

    it('successfully delete account', async () => {
        (authService.signOut as jest.Mock).mockResolvedValueOnce({ success: true })

        let actionFn: () => void = () => {}
        (showMessage as jest.Mock).mockImplementationOnce(({ action }) => {
            actionFn = action.onPress
        })

        const { result } = renderHook(() => useMenu({ navigation }))
        await act(() => result.current.deleteAccount())

        await act(async () => {
            actionFn()
        })

        expect(navigation.reset).toHaveBeenCalledWith({ 
            index: 0, 
            routes: [{ name: "initial-stack" }] 
        })
    })

    it('show error if deleteAccount fails', async () => {
        ;(authService.signOut as jest.Mock)
            .mockResolvedValueOnce({ success: false, message: 'Error when exiting' })

        let actionFn: () => void = () => {}
        (showMessage as jest.Mock).mockImplementationOnce(({ action }) => {
            actionFn = action.onPress
        })

        const { result } = renderHook(() => useMenu({ navigation }))
        await act(() => result.current.deleteAccount())

        await act(async () => actionFn())

        expect(pushMessage).toHaveBeenCalledWith('Error when exiting')
    })
})
