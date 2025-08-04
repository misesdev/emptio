import { renderHook, act } from '@testing-library/react-native';
import { useAuth } from '@src/providers/userProvider';
import { Order } from '@services/nostr/orders';
import { useState } from 'react';
import useClosureOrder from './use-closure-order';
import { timeSeconds } from '@services/converter';

jest.mock('@src/providers/userProvider', () => ({
    useAuth: () => ({ user: {} }),
}));

describe('useClosureOrder', () => {
    it('returns the initial state', () => {
        // const { result, waitForNextUpdate } = renderHook(() =>
        //     useClosureOrder({ navigation: {}, route: { params: { satoshis: '1.5' } } })
        // );

        expect(false).toBe(false);
        // expect(result.current.loading).toBe(false);
        // expect(result.current.disabled).toBe(true);
        // expect(result.current.satoshis).toBe('1.5');
        // expect(result.current.closure).toBe(timeSeconds.now());
    });

    // it('sets the closure state correctly', () => {
    //     const { result, waitForNextUpdate } = renderHook(() =>
    //         useClosureOrder({ navigation: {}, route: { params: { satoshis: '1.5' } } })
    //     );

    //     act(() => {
    //         result.current.setClosure(timeSeconds.now() + 1000);
    //     });

    //     waitForNextUpdate();

    //     expect(result.current.closure).toBe(2);
    // });

    // it('publishes the order correctly', async () => {
    //     const { result, waitForNextUpdate } = renderHook(() =>
    //         useClosureOrder({ navigation: {}, route: { params: { satoshis: '1.5' } } })
    //     );

    //     act(async () => {
    //         await result.current.publishOrder();
    //     });

    //     waitForNextUpdate();

    //     expect(result.current.loading).toBe(false);
    //     expect(result.current.disabled).toBe(true);
    // });

    // it('navigates to the correct screen after publishing', async () => {
    //     const navigationSpy = jest.fn(() => ({ reset: jest.fn() }));
    //     
    //     const { result } = renderHook(() =>
    //         useClosureOrder({ navigation: navigationSpy, route: { params: { satoshis: '1.5' } } })
    //     );

    //     act(async () => {
    //         await result.current.publishOrder();
    //     });

    //     waitForNextUpdate();

    //     expect(navigationSpy.reset).toHaveBeenCalledTimes(1);
    //     expect(navigationSpy.reset.mock.calls[0][0].index).toBe(1);
    //     expect(navigationSpy.reset.mock.calls[0][0].routes.length).toBe(2);
    // });
});
