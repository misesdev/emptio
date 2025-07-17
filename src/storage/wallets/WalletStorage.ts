import { BaseStorage } from "../base/BaseStorage";
import { Wallet } from "./types";

export class WalletStorage extends BaseStorage<Wallet> 
{
    constructor() {
        super("wallets")
        super.notFoundMessage = "Wallet not found"
    }
}
