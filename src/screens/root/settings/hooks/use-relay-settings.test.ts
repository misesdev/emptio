import { renderHook, act } from '@testing-library/react-native'
import useRelaySettings from './use-relay-settings'

// Mock NDKRelay type
const mockRelays = [
    { url: 'relay1', connected: true },
    { url: 'relay2', connected: false },
    { url: 'relay3', connected: true },
]

describe('useRelaySettings hook', () => {
    const navigation = { navigate: jest.fn() }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('initializes relayData correctly based on ndk pool', () => {
        
        const { result } = renderHook(() => useRelaySettings({ navigation }))

        expect(result.current.relayData).toBeDefined()
        expect(result.current.relayData?.all.length).toBe(3)
        expect(result.current.relayData?.connected.length).toBe(2)
        expect(result.current.relayData?.disconected.length).toBe(1)

        expect(result.current.relayData?.connected).toEqual(mockRelays.filter(r => r.connected))

        expect(result.current.relayData?.disconected).toEqual([
            mockRelays[1],
        ])
    })

    it('calls navigation.navigate with correct params on openRelay', () => {
        const { result } = renderHook(() => useRelaySettings({ navigation }))

        act(() => {
            result.current.openRelay(mockRelays[0] as any)
        })

        expect(navigation.navigate).toHaveBeenCalledWith('manage-relay-stack', {
            relay: mockRelays[0],
        })
    })
})
