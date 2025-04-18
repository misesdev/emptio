import { renderHook, act } from '@testing-library/react-native'
import useMenu from './use-menu'
import { storageService } from '@services/memory'
import { userService } from '@services/user'
import { showMessage } from '@components/general/MessageBox'
import { pushMessage } from '@services/notification'

// Mocks diretos
jest.mock('react-native-device-info', () => ({
    getVersion: () => '1.2.3',
}))

const copyToClipboard = jest.fn()
jest.mock('@src/utils', () => ({
    copyToClipboard: (...args: any[]) => copyToClipboard(...args),
}))

const checkBiometric = jest.fn()
jest.mock('@services/auth', () => ({
    authService: {
        checkBiometric: (...args: any[]) => checkBiometric(...args),
    },
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

describe('useMenu (sem spy)', () => {
    const navigation = { reset: jest.fn() }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('inicializa corretamente', () => {
        const { result } = renderHook(() => useMenu({ navigation }))

        expect(result.current.appVersion).toBe('1.2.3')
        expect(result.current.poolstats.connected).toBe(2)
        expect(result.current.poolstats.total).toBe(3)
    })

    it('copia chave pública', async () => {
        ;(storageService.secrets.getPairKey as jest.Mock)
            .mockResolvedValueOnce({ publicKey: 'pub123' })

        const { result } = renderHook(() => useMenu({ navigation }))
        await act(() => result.current.copyPublicKey())

        expect(copyToClipboard).toHaveBeenCalledWith('npub-pub123')
    })

    it('copia chave secreta se biometria estiver OK', async () => {
        checkBiometric.mockResolvedValueOnce(true)
        ;(storageService.secrets.getPairKey as jest.Mock)
            .mockResolvedValueOnce({ privateKey: 'deadbeef' })

        const { result } = renderHook(() => useMenu({ navigation }))
        await act(() => result.current.copySecretKey())

        expect(copyToClipboard).toHaveBeenCalledWith('nsec-bytes-of-deadbeef')
    })

    it('deleta conta com sucesso', async () => {
        (userService.signOut as jest.Mock).mockResolvedValueOnce({ success: true })

        let actionFn: () => void = () => {}
        (showMessage as jest.Mock).mockImplementationOnce(({ action }) => {
            actionFn = action.onPress
        })

        const { result } = renderHook(() => useMenu({ navigation }))
        await act(() => result.current.deleteAccount())

        await act(async () => {
            await actionFn()
        })

        expect(navigation.reset).toHaveBeenCalled()
    })

    it('mostra erro se deleteAccount falhar', async () => {
        ;(userService.signOut as jest.Mock)
            .mockResolvedValueOnce({ success: false, message: 'Erro ao sair' })

        let actionFn: () => void = () => {}
        (showMessage as jest.Mock).mockImplementationOnce(({ action }) => {
            actionFn = action.onPress
        })

        const { result } = renderHook(() => useMenu({ navigation }))
        await act(() => result.current.deleteAccount())

        await act(() => actionFn())

        expect(pushMessage).toHaveBeenCalledWith('Erro ao sair')
    })
})
