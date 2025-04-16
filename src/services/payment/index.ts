
import { PaymentProvider } from "./PaymentProvider";

export class PaymentService {
    private provider: PaymentProvider;

    constructor(provider: PaymentProvider) {
        this.provider = provider;
    }
}

