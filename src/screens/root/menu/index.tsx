import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from "react-native"
import { getUser } from "@src/services/memory"
import { LinkSection, Section } from "@components/general/Section"
import { ButtonDanger } from "@components/form/Buttons"
import { useTranslate } from "@src/services/translate"
import SplashScreen from "@components/general/SplashScreen"
import { useEffect, useState } from "react"
import theme from "@src/theme"
import { SignOut } from "@/src/services/userManager"
import MessageBox, { showMessage } from "@/src/components/general/MessageBox"

const UserMenu = ({ navigation }: any) => {

    const [name, setName] = useState<string>()
    const [banner, setBanner] = useState<string>()
    const [picture, setPicture] = useState<string>()
    const [loading, setLoading] = useState(false)    

    useEffect(() => { handleLoadUserInfo() }, [])

    const handleLoadUserInfo = async () => {
        const { picture, name, banner } = await getUser()
        setPicture(picture)
        setBanner(banner)
        setName(name)
    }

    const handleDeleteAccount = async () => {

        setLoading(true)

        setTimeout(async () => { 
            const result = await SignOut()

            if(result.success)
                navigation.reset({ index: 0, routes: [{ name: "initial-stack" }] })
            else
                showMessage({ message: `Ocorreu um erro inesperado durante a regisição: ${result.message}` })
        }, 300)
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
                <Text style={styles.name}>{name}</Text>
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
                    <ButtonDanger label={useTranslate("commons.signout")} onPress={handleDeleteAccount} />
                </View>
            </ScrollView>
            <MessageBox />
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