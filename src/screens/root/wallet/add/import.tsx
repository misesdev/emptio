import { HeaderScreen } from "@components/general/HeaderScreen"
import { StyleSheet, View, Text } from "react-native"
import { useTranslate } from "@/src/services/translate"
import { FormControl } from "@components/form/FormControl"
import { ButtonPrimary } from "@components/form/Buttons"
import { useState } from "react"
import theme from "@src/theme"

const ImportWalletScreen = ({ navigation }: any) => {

    const [seedPhrase, setSeedPhrase] = useState<string>()

    const handleImport = () => {

    }

    return (
        <>
            {/* Header */}
            <HeaderScreen
                title={useTranslate("screen.title.importwallet")}
                onClose={() => navigation.navigate("add-wallet-stack")}
            />

            {/* Body */}
            <View style={theme.styles.container}>

                <Text style={styles.title}>{useTranslate("wallet.title.import")}</Text>

                <FormControl label="Your Seed Phrase" value={seedPhrase} onChangeText={setSeedPhrase} isTextArea />

            </View>

            {/* Body */}
            <View style={styles.buttonArea}>
                <ButtonPrimary label={useTranslate("commons.import")} onPress={() => handleImport()} />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    title: { fontSize: 30, maxWidth: "90%", fontWeight: "bold", textAlign: "center", color: theme.colors.white },
    buttonArea: { width: '100%', position: 'absolute', justifyContent: 'center', marginVertical: 10, flexDirection: "row", bottom: 10 }
})

export default ImportWalletScreen