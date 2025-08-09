import OptionButtonScreen from "@components/form/OptionButtonScreen";
import ModalBottom, { showModalBottom } from "@components/modal/ModalBottom"
import { useTranslateService } from "@src/providers/TranslateProvider"
import { View, StyleSheet } from "react-native";

var showNewWalletFunction: () => void;

type NewWalletModalProps = {
    navigation: any;
}

const NewWalletModal = ({ navigation }: NewWalletModalProps) => {
   
    showNewWalletFunction = showModalBottom;
    const { useTranslate } = useTranslateService()

    const onCreate = () => navigation.navigate("create-wallet")
    const onImport = () => navigation.navigate("import-wallet")

    return (
        <ModalBottom heightPercent={48}
            title={useTranslate("screen.title.addwallet")}
        >
            <View style={styles.content}>
                <OptionButtonScreen 
                    icon="duplicate" 
                    onPress={onCreate}
                    label={useTranslate("commons.create")}
                    description="Criar uma carteira nova de 12 palavras bip39 com passphrase"
                />
                <OptionButtonScreen 
                    icon="key"
                    onPress={onImport}
                    label={useTranslate("commons.import")}
                    description="Importar uma carteira a partir da 12 palavras bip39"
                />
            </View>
        </ModalBottom>
    )
}

export const showNewWaleltModal = () => {
    showNewWalletFunction()
}

const styles = StyleSheet.create({
    content: { width: "100%", alignItems: "center", marginVertical: 10 } 
})

export default NewWalletModal
