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

    const { picture, displayName, banner } = getUser()

    const handleDeleteAccount = () => {

        setLoading(true)

        setTimeout(() => SignOut(() => navigation.reset({ index: 0, routes: [{ name: "initial-stack" }] })), 500)
    }

    if (loading)
        return <SplashScreen message="deleting storage.." />

    return (
        <>
            {banner && <Image style={styles.banner} source={{ uri: banner }} />}
            <View style={{ width: "100%", height: 30 }}></View>
            <View style={styles.area}>
                <TouchableOpacity onPress={() => navigation.navigate("user-edit-stack")}>
                    <View style={styles.image}>
                        {picture && <Image source={{ uri: picture }} style={styles.picture} />}
                        {!picture && <Image source={require("assets/images/defaultProfile.png")} style={styles.picture} />}
                    </View>
                </TouchableOpacity>
                <Text style={styles.name}>{displayName}</Text>
            </View>
            <ScrollView contentContainerStyle={theme.styles.scroll_container}>
                <Section>
                    <LinkSection label="Settigns" icon="settings" onPress={() => { }} />
                    <LinkSection label="Manage Keys" icon="settings" onPress={() => { }} />
                    <LinkSection label="settigns" icon="settings" onPress={() => { }} />
                    <LinkSection label="settigns" icon="settings" onPress={() => { }} />
                </Section>

                <Section>
                    <LinkSection label="Settigns" icon="settings" onPress={() => { }} />
                    <LinkSection label="Manage Keys" icon="settings" onPress={() => { }} />
                    <LinkSection label="settigns" icon="settings" onPress={() => { }} />
                    <LinkSection label="settigns" icon="settings" onPress={() => { }} />
                </Section>

                <View style={{ padding: 20 }}>
                    <ButtonDanger label={useTranslate("commons.delete.account")} onPress={handleDeleteAccount} />
                </View>
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    area: {
        width: "100%",
        alignItems: "center",
        marginVertical: 10
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.colors.white,
        backgroundColor: theme.colors.section,
        paddingHorizontal: 18,
        marginVertical: 10,
        borderRadius: 25,
        padding: 10,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: theme.colors.gray,
    },
    picture: {
        zIndex: 999,
        width: "100%",
        height: "100%",
        borderRadius: 50,
        borderWidth: 2,
        borderColor: theme.colors.section,
    },
    banner: {
        width: "100%",
        height: 200,
        position: "absolute",
        top: 0,
        zIndex: 0
    }
})

export default UserMenu