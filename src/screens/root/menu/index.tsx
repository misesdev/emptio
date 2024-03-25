import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from "react-native"
import { getUser } from "@src/services/memory"
import theme from "@src/theme"
import { LinkSection, Section } from "@components/general/Section"
import { ButtonDanger } from "@components/form/Buttons"
import { useTranslate } from "@src/services/translate"

const UserMenu = ({ navigation }: any) => {

    const { profile, userName } = getUser()

    const handleEdit = () => navigation.navigate("user-edit-stack")

    const handleDeleteAccount = () => {
        navigation.reset({ index: 0, routes:[{ name: "initial-stack" }] })
    }

    return (
        <ScrollView contentContainerStyle={theme.styles.scroll_container}>
            <View style={{ width: "100%", height: 70 }}></View>
            <View style={styles.userArea}>
                <TouchableOpacity onPress={handleEdit}>
                    <View style={styles.userIcon}>
                        {profile && <Image source={{ uri: profile }} style={styles.userImage} />}
                        {!profile && <Image source={require("assets/images/defaultProfile.png")} style={styles.userImage} />}
                    </View>
                </TouchableOpacity>
                <Text style={styles.userName}>{userName}</Text>
            </View>

            <Section>
                <LinkSection label="Settigns" icon="settings" onPress={() => {}}/>
                <LinkSection label="Manage Keys" icon="settings" onPress={() => {}}/>
                <LinkSection label="settigns" icon="settings" onPress={() => {}}/>
                <LinkSection label="settigns" icon="settings" onPress={() => {}}/>
            </Section>

            <Section>
                <LinkSection label="Settigns" icon="settings" onPress={() => {}}/>
                <LinkSection label="Manage Keys" icon="settings" onPress={() => {}}/>
                <LinkSection label="settigns" icon="settings" onPress={() => {}}/>
                <LinkSection label="settigns" icon="settings" onPress={() => {}}/>
            </Section>

            <View style={{ padding: 20 }}>
                <ButtonDanger  label={useTranslate("commons.delete.account")} onPress={handleDeleteAccount}/>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    userArea: {
        width: "100%",
        alignItems: "center",
        marginVertical: 10
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.colors.gray,
        marginVertical: 10
    },
    userIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: theme.colors.gray,
    },
    userImage: {
        width: "100%",
        height: "100%",
        borderRadius: 50
    }
})

export default UserMenu