import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from "react-native"
import { hasHardwareAsync, authenticateAsync } from 'expo-local-authentication';
import { LinkSection, SectionContainer } from "@components/general/section"
import MessageBox, { showMessage } from "@components/general/MessageBox"
import { getPairKey } from "@src/services/memory/pairkeys"
import SplashScreen from "@components/general/SplashScreen"
import { useAuth } from "@src/providers/userProvider"
import { ButtonDanger } from "@components/form/Buttons"
import { useTranslate } from "@src/services/translate"
import { SignOut } from "@src/services/userManager"
import { hexToBytes } from "@noble/hashes/utils"
import { useState } from "react"
import { nip19 } from "nostr-tools";
import theme from "@src/theme"
import { setStringAsync } from "expo-clipboard";


const UserMenuScreen = ({ navigation }: any) => {

    const opacity = .6
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)    

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

    const checkBiometric = async () => {
        const isBiometricAvailable = await hasHardwareAsync()

        if (isBiometricAvailable) {
            const { success } = await authenticateAsync({
                promptMessage: useTranslate("commons.authenticate.message"),
            })
    
            return success
        }            
        else
            return true
    };

    const handleCopyKeys = async () => { 
        const biometrics = await checkBiometric()

        const { privateKey } = await getPairKey(user?.keychanges ?? "")

        if (biometrics) {
            const secretkey = nip19.nsecEncode(hexToBytes(privateKey))
            await setStringAsync(secretkey)
        }
    }

    if (loading)
        return <SplashScreen message="deleting storage.." />

    return (
        <>
            {user?.banner && <Image style={styles.banner} source={{ uri: user?.banner }} />}
            <View style={{ width: "100%", height: 58 }}></View>
            <View style={styles.area}>
                <TouchableOpacity activeOpacity={opacity} onPress={() => navigation.navigate("user-edit-stack")}>
                    <View style={styles.image}>
                        {user?.picture && <Image source={{ uri: user?.picture }} style={styles.picture} />}
                        {!user?.picture && <Image source={require("assets/images/defaultProfile.png")} style={styles.picture} />}
                    </View>
                </TouchableOpacity>
                <Text style={styles.name}>{user?.name}</Text>
            </View>
            <ScrollView contentContainerStyle={theme.styles.scroll_container}>
                <SectionContainer>
                    <LinkSection label={useTranslate("settings.account.edit")} icon="person" onPress={() => navigation.navigate("user-edit-stack")} />
                    <LinkSection label={useTranslate("settings.secretkey.copy")} icon="document-lock-outline" onPress={handleCopyKeys} />
                    <LinkSection label={useTranslate("settings.security")} icon="settings" onPress={() => navigation.navigate("manage-security-stack")} />
                </SectionContainer>

                <SectionContainer>
                    <LinkSection label="Wallet" icon="settings" onPress={() => navigation.navigate("wallet-stack")} />
                    <LinkSection label={useTranslate("settings.chooselanguage")} icon="language" onPress={() => { }} />                   
                    <LinkSection label={useTranslate("settings.relays")} icon="earth" onPress={() => navigation.navigate("manage-relays-stack")} />
                    <LinkSection label={useTranslate("settings.about")} icon="settings" onPress={() => navigation.navigate("about-stack")} />
                </SectionContainer>

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
        zIndex: 99,
        width: "100%",
        height: "100%",
        borderRadius: 50,
        borderWidth: 2,
        borderColor: theme.colors.section,
    },
    banner: {
        width: "100%",
        height: 120,
        position: "absolute",
        top: 0,
        zIndex: 0
    }
})

export default UserMenuScreen