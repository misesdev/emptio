import { BNetwork, HDWallet, MnemonicUtils } from "bitcoin-tx-lib";

export default class WalletFactory 
{    
    public generateMnemonic(strength: 128|256 = 128): string 
    {
        return MnemonicUtils.generateMnemonic(strength)
    }

    public create(mnemonic: string, network: BNetwork, passphrase:string): Uint8Array
    {
        const { wallet } = HDWallet.import(mnemonic, passphrase, { network })
        return wallet.getMasterPrivateKey()
    }
} 
