import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { HeaderScreen } from "@components/general/HeaderScreen"
import { useTranslateService } from "@src/providers/translateProvider"
import { StackScreenProps } from "@react-navigation/stack"
import { ScrollView } from "react-native-gesture-handler"
import theme from "@src/theme"

const NewWalletScreen = ({ navigation }: StackScreenProps<any>) => {

    const { useTranslate } = useTranslateService()

    const handleCreate = () => navigation.navigate("create-wallet")
    const handleImport = () => navigation.navigate("import-wallet")

    return (
        <ScrollView contentContainerStyle={theme.styles.container}>
            <HeaderScreen 
                style={{ position: "absolute", top: 10 }}
                title={useTranslate("screen.title.addwallet")}
                onClose={() => navigation.goBack()}
            />

            <View style={{ width: "100%", alignItems: "center", marginVertical: 30 }}>
                <TouchableOpacity 
                    activeOpacity={.7}
                    style={styles.selection}
                    onPress={handleCreate}
                >
                    <View style={{ width: "15%", height: "100%", alignItems: "center", justifyContent: "center" }}>
                        <Ionicons name="duplicate" size={theme.icons.large} color={theme.colors.white} />
                    </View>
                    <View style={{ width: "85%" }}>
                        <Text style={[styles.typeTitle, { color: theme.colors.white }]}>
                            {useTranslate("commons.create")}
                        </Text>
                        <Text style={styles.typeDescription}>
                            Criar uma carteira nova 
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity 
                    activeOpacity={.7}
                    style={styles.selection}
                    onPress={handleImport}
                >
                    <View style={{ width: "15%", height: "100%", alignItems: "center", justifyContent: "center" }}>
                        <Ionicons name="key" size={theme.icons.large} color={theme.colors.white} />
                    </View>
                    <View style={{ width: "85%" }}>
                        <Text style={[styles.typeTitle, { color: theme.colors.white }]}>
                            {useTranslate("commons.import")}
                        </Text>
                        <Text style={styles.typeDescription}>
                            Importar uma carteira a partir das 12 palavras bip39
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', backgroundColor: theme.colors.black },
    title: { top: 50, fontSize: 22, fontWeight: 'bold', position: "absolute", 
        color: theme.colors.white },
    selection: { width: "90%", minHeight: 20, maxHeight: 100, borderRadius: 10, 
        marginVertical: 10, flexDirection: "row", borderWidth: 1,
        backgroundColor: theme.colors.blueOpacity },
    typeTitle: { marginLeft: 6, fontSize: 16, fontWeight: "bold", marginTop: 15, 
        color: theme.colors.white },
    typeDescription: { marginBottom: 15, padding: 6, color: theme.colors.gray },
})

export default NewWalletScreen
