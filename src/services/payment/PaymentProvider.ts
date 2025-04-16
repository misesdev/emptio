
export interface PaymentProvider {
    initialize(config: any): Promise<void>;
    createBilling(amount: number, currency: string, metadata?: any): Promise<void>
}
