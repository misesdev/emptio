import { BNetwork } from "bitcoin-tx-lib";

export type CreateProps = {
    mnemonic: string; passphrase:string; network?: BNetwork;
}

interface IWalletFactory {
    generateMnemonic(strength?: 128|256): string;
    create(props: CreateProps): Promise<Uint8Array>;
}

export default IWalletFactory
