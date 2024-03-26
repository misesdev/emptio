import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from "react-native"
import { clearStorage, getUser } from "@src/services/memory"
import { LinkSection, Section } from "@components/general/Section"
import { ButtonDanger } from "@components/form/Buttons"
import { useTranslate } from "@src/services/translate"
import SplashScreen from "@components/general/SplashScreen"
import { useState } from "react"
import theme from "@src/theme"
import { SignOut } from "@/src/services/userManager"

const UserMenu = ({ navigation }: any) => {

    const [loading, setLoading] = useState(false)

    const { picture, name } = getUser()

    const handleDeleteAccount = () => {

        setLoading(true)

        setTimeout(() => SignOut(() => navigation.reset({ index: 0, routes:[{ name: "initial-stack" }] })), 500)
    }

    if(loading)
        return <SplashScreen message="deleting storage.."/>

    return (
        <ScrollView contentContainerStyle={theme.styles.scroll_container}>
            <View style={{ width: "100%", height: 70 }}></View>
            <View style={styles.userArea}>
                <TouchableOpacity onPress={() => navigation.navigate("user-edit-stack")}>
                    <View style={styles.userIcon}>
                        {picture && <Image source={{ uri: picture }} style={styles.userImage} />}
                        {!picture && <Image source={require("assets/images/defaultProfile.png")} style={styles.userImage} />}
                    </View>
                </TouchableOpacity>
                <Text style={styles.userName}>{name}</Text>
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
        borderRadius: 50,
        borderWidth: 2,
        borderColor: theme.colors.green
    }
})

export default UserMenu