import EncryptedStorage from 'react-native-encrypted-storage';
import { PaymentStorage } from './index';
import { PaymentKey } from '../types';

jest.mock('react-native-encrypted-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
}));

const mockKey: PaymentKey = {
    key: 'abc123',
    secret: 'nsec123'
};

describe('PaymentStorage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('list', () => {
        it('should return an empty list if storage is empty', async () => {
            (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(null);
            const result = await PaymentStorage.list();
            expect(result).toEqual([]);
            expect(EncryptedStorage.getItem).toHaveBeenCalledWith('paymentkeys');
        });

        it('should return parsed payment keys if they exist', async () => {
            (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([mockKey]));
            const result = await PaymentStorage.list();
            expect(result).toEqual([mockKey]);
        });
    });

    describe('get', () => {
        it('should return a payment key by its key', async () => {
            (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([mockKey]));
            const result = await PaymentStorage.get('abc123');
            expect(result).toEqual(mockKey);
        });

        it('should throw error if payment key is not found', async () => {
            (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));
            await expect(PaymentStorage.get('notfound')).rejects.toThrow('payment key not found');
        });
    });

    describe('add', () => {
        it('should add a new payment key to storage', async () => {
            (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));
            await PaymentStorage.add(mockKey);
            expect(EncryptedStorage.setItem).toHaveBeenCalledWith(
                'paymentkeys',
                JSON.stringify([mockKey])
            );
        });

        it('should append a new key to existing ones', async () => {
            const existing = [{ key: 'oldkey', pubkey: 'npubOld', privkey: 'nsecOld' }];
            (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(existing));
            await PaymentStorage.add(mockKey);
            expect(EncryptedStorage.setItem).toHaveBeenCalledWith(
                'paymentkeys',
                JSON.stringify([...existing, mockKey])
            );
        });
    });

    describe('delete', () => {
        it('should delete the key by id', async () => {
            const keys = [mockKey, { key: 'other', pubkey: 'pub', privkey: 'priv' }];
            (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(keys));
            await PaymentStorage.delete('abc123');
            expect(EncryptedStorage.setItem).toHaveBeenCalledWith(
                'paymentkeys',
                JSON.stringify([{ key: 'other', pubkey: 'pub', privkey: 'priv' }])
            );
        });
    });

    describe('save', () => {
        it('should serialize and store payment keys', async () => {
            await PaymentStorage.save([mockKey]);
            expect(EncryptedStorage.setItem).toHaveBeenCalledWith(
                'paymentkeys',
                JSON.stringify([mockKey])
            );
        });
    });

    describe('clear', () => {
        it('should remove all stored keys', async () => {
            await PaymentStorage.clear();
            expect(EncryptedStorage.removeItem).toHaveBeenCalledWith('paymentkeys');
        });
    });
});

