
import { StyleSheet, View, Text, ScrollView } from "react-native"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { useTranslate } from "@/src/services/translate"
import MessageBox, { showMessage } from "@components/general/MessageBox"
import { ButtonPrimary } from "@components/form/Buttons"
import { RelayList } from "@components/nostr/relays/RelayList"
import theme from "@src/theme"

const ManageRelaysScreen = ({ navigation }: any) => {

    const handleAddRelay = () => {

    }

    const handleDeleteRelay = () => {
        showMessage({
            title: "Excluir Relay?",
            message: "O Relay será permanentemente excluído, deseja continuar?",
            action: { label: useTranslate("commons.delete"), onPress: () => { } }
        })
    }

    return (
        <>
            <HeaderScreen title={useTranslate("settings.relays")} onClose={() => navigation.navigate("user-menu-stack")} />
            <ScrollView contentContainerStyle={theme.styles.scroll_container} >

                <RelayList />

                <View style={{ height: 80 }}></View>

            </ScrollView>
            <View style={styles.buttonarea}>
                <ButtonPrimary label="Add Relay" onPress={handleAddRelay} />
            </View>
            <MessageBox />
        </>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.colors.gray
    },
    buttonarea: {
        width: "100%",
        position: "absolute",
        // justifyContent: "center",
        alignItems: "center",
        bottom: 10,
    }
})

export default ManageRelaysScreen