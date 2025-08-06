import { useTranslateService } from "@src/providers/TranslateProvider";
import { pushMessage } from "@services/notification";
import { Wallet } from "@services/wallet/types/Wallet";
import { useService } from "@src/providers/ServiceProvider";
import { StoredItem } from "@storage/types";
import { BNetwork } from "bitcoin-tx-lib";

type Props = {
    name: string;
    mnemonic: string;
    passphrase: string;
    network: BNetwork;
}

const useCreateWallet = ({ name, mnemonic, passphrase, network }: Props) => {

    const { useTranslate } = useTranslateService()
    const { walletFactory, walletService } = useService()

    const onCreate = async (): Promise<StoredItem<Wallet>> => {
        const masterKey = await walletFactory.create({ 
            mnemonic, 
            passphrase,
            network 
        })
        const result = await walletService.add({ name, masterKey, network })
        if(!result.success) {
            pushMessage(useTranslate("message.default_error"))
            return {} as StoredItem<Wallet>
        }
        return result.data as StoredItem<Wallet>
    }

    return {
        onCreate
    }
}

export default useCreateWallet
