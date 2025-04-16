
import { PaymentProvider } from "./PaymentProvider";

export class StripeProvider implements PaymentProvider {
    private publishableKey: string;
    private merchantIdentifier?: string;

    constructor(publishableKey: string, merchantIdentifier?: string) {
        this.publishableKey = publishableKey;
        this.merchantIdentifier = merchantIdentifier;
    }

    async initialize() {
    
    }

    async createBilling(amount: number, currency: string, metadata?: any): Promise<void> {

    }
}
