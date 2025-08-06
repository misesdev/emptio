import IWalletFactory, { CreateProps } from "./IWalletFactory";
import { HDWallet, MnemonicUtils } from "bitcoin-tx-lib";

class WalletFactory implements IWalletFactory
{   
    constructor() {

    }

    public generateMnemonic(strength: 128|256 = 128): string 
    {
        return MnemonicUtils.generateMnemonic(strength)
    }

    public async create({ mnemonic, passphrase, network="mainnet" }: CreateProps): Promise<Uint8Array> 
    {
        const { wallet } = HDWallet.import(mnemonic, passphrase, { network })
        const masterKey = wallet.getMasterPrivateKey()
        return masterKey
    }
}

export default WalletFactory
