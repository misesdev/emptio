import { Wallet } from "@services/wallet/types/Wallet";
import { BaseStorage } from "../base/BaseStorage";

export class WalletStorage extends BaseStorage<Wallet> 
{
    constructor() {
        super("wallets")
        super.notFoundMessage = "Wallet not found"
    }
}
