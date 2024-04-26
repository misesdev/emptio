import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from "react-native"
import { LinkSection, SectionContainer } from "@components/general/section"
import { getPairKey } from "@src/services/memory/pairkeys"
import SplashScreen from "@components/general/SplashScreen"
import { useAuth } from "@src/providers/userProvider"
import { ButtonDanger } from "@components/form/Buttons"
import { useTranslate } from "@src/services/translate"
import { userService } from "@/src/core/userManager"
import { hexToBytes } from "@noble/hashes/utils"
import { useState } from "react"
import { nip19 } from "nostr-tools";
import theme from "@src/theme"
import { setStringAsync } from "expo-clipboard";
import AlertBox, { alertMessage } from "@components/general/AlertBox";
import { Ionicons } from "@expo/vector-icons"
import { authService } from "@/src/core/authManager";

const UserMenuScreen = ({ navigation }: any) => {

    const opacity = .7
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)

    const handleCopySecretKey = async () => {
        const biometrics = await authService.checkBiometric()

        const { privateKey } = await getPairKey(user?.keychanges ?? "")

        if (biometrics) {
            const secretkey = nip19.nsecEncode(hexToBytes(privateKey))

            await setStringAsync(secretkey)

            alertMessage(useTranslate("message.copied"))
        }
    }

    const handleCopyPublicKey = async () => {
        const { publicKey } = await getPairKey(user?.keychanges ?? "")

        const pubKey = nip19.npubEncode(publicKey)

        await setStringAsync(pubKey)

        alertMessage(useTranslate("message.copied"))
    }

    const handleDeleteAccount = async () => {

        setLoading(true)

        setTimeout(async () => {
            const result = await userService.signOut()

            if (result.success)
                navigation.reset({ index: 0, routes: [{ name: "initial-stack" }] })
            else
                alertMessage(result.message)
        }, 300)
    }

    if (loading)
        return <SplashScreen message="deleting storage.." />

    return (
        <>
            <View style={styles.banner}>
                {user?.banner && <Image style={{ flex: 1 }} source={{ uri: user?.banner }} />}
            </View>
            <View style={{ height: 60 }}></View>
            <View style={styles.area}>
                <TouchableOpacity activeOpacity={opacity} onPress={() => navigation.navigate("manage-account-stack")}>
                    <View style={styles.image}>
                        {user?.picture && <Image source={{ uri: user?.picture }} style={{ flex: 1 }} />}
                        {!user?.picture && <Image source={require("assets/images/defaultProfile.png")} style={{ flex: 1 }} />}
                    </View>
                </TouchableOpacity>
                <Text style={styles.name}>{user?.name}</Text>
            </View>
            <ScrollView contentContainerStyle={theme.styles.scroll_container}>

                <View style={styles.sectiontop}>
                    <TouchableOpacity style={styles.mediumsection} activeOpacity={.7}>
                        <SectionContainer style={styles.mediumcontainer}>
                            <Ionicons name="people" color={theme.colors.white} size={theme.icons.large} style={{ marginVertical: 10 }} />
                            <Text style={{ color: theme.colors.white }}>{useTranslate("section.title.talkdevelopers")}</Text>
                            <Text style={{ color: theme.colors.gray, fontSize: 12 }}>Convide seus amigos para o app, compartilhe!</Text>
                        </SectionContainer>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.mediumsection} activeOpacity={.7}>
                        <SectionContainer style={styles.mediumcontainer}>
                            <Ionicons name="paper-plane" color={theme.colors.white} size={theme.icons.large} style={{ marginVertical: 10 }} />
                            <Text style={{ color: theme.colors.white }}>{useTranslate("section.title.sharefriend")}</Text>
                            <Text style={{ color: theme.colors.gray, fontSize: 12 }}>Convide seus amigos para o app, compartilhe a jornada bitconheira!</Text>
                        </SectionContainer>
                    </TouchableOpacity>
                </View>

                <SectionContainer>
                    <LinkSection label={useTranslate("settings.account.edit")} icon="person" onPress={() => navigation.navigate("manage-account-stack")} />
                    <LinkSection label={useTranslate("settings.nostrkey.copy")} icon="document-lock-outline" onPress={handleCopyPublicKey} />
                    <LinkSection label={useTranslate("settings.secretkey.copy")} icon="document-lock-outline" onPress={handleCopySecretKey} />
                    <LinkSection label={useTranslate("settings.security")} icon="settings" onPress={() => navigation.navigate("manage-security-stack")} />
                </SectionContainer>

                <SectionContainer>
                    {/* <LinkSection label="Wallet" icon="settings" onPress={() => navigation.navigate("wallet-stack")} /> */}
                    <LinkSection label={useTranslate("settings.chooselanguage")} icon="language" onPress={() => { }} />
                    <LinkSection label={useTranslate("settings.relays")} icon="earth" onPress={() => navigation.navigate("manage-relays-stack")} />
                    <LinkSection label={useTranslate("settings.about")} icon="settings" onPress={() => navigation.navigate("about-stack")} />
                </SectionContainer>

                <View style={{ padding: 20 }}>
                    <ButtonDanger label={useTranslate("commons.signout")} onPress={handleDeleteAccount} />
                </View>
            </ScrollView>
            <AlertBox />
        </>
    )
}

const styles = StyleSheet.create({
    mediumcontainer: { padding: 10, height: 135 },
    sectiontop: { width: "98%", flexDirection: "row", alignItems: "center" },
    mediumsection: { width: "50%", alignItems: "center", height: "100%" },
    area: { width: "100%", alignItems: "center", marginVertical: 10 },
    name: { fontSize: 18, fontWeight: 'bold', color: theme.colors.white, marginVertical: 10 },
    image: { width: 100, height: 100, borderRadius: 50, backgroundColor: theme.colors.gray, overflow: "hidden", borderWidth: 2, borderColor: theme.colors.section },
    banner: { width: "100%", height: 140, position: "absolute", top: 0 }
})

export default UserMenuScreen