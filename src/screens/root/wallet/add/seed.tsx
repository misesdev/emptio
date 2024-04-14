import { HeaderScreen } from "@components/general/HeaderScreen"
import theme from "@src/theme"
import { StyleSheet, Text } from "react-native"

const CreatedSeedScren = ({ navigation, route }: any) => {

    const seedPhrase = route.params?.seed ?? ""

    return (
        <>
            <HeaderScreen  
                title="Created Wallet"
                onClose={() => navigation.navigate("add-wallet-stack")}
            />

            <Text style={styles.title}>Gurade sua seed e sua passphrase para recuperar sua carteira em qualquer outro smartphone em qualquer situação!</Text>

        </>
    )
}

const styles = StyleSheet.create({
    title: { fontSize: 30, maxWidth: "90%", fontWeight: "bold", textAlign: "center", color: theme.colors.white, marginVertical: 20 },
})

export default CreatedSeedScren
