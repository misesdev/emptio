import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from "react-native"
import { LinkSection, SectionContainer } from "@components/general/section"
import { getPairKey } from "@src/services/memory/pairkeys"
import SplashScreen from "@components/general/SplashScreen"
import { useAuth } from "@src/providers/userProvider"
import { ButtonLink } from "@components/form/Buttons"
import { userService } from "@/src/core/userManager"
import { hexToBytes } from "@noble/hashes/utils"
import { useState } from "react"
import { nip19 } from "nostr-tools";
import theme from "@src/theme"
import { setStringAsync } from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons"
import { authService } from "@src/core/authManager";
import MessageBox, { showMessage } from "@components/general/MessageBox"
import SelectLanguageBox, { showSelectLanguage } from "@components/modal/SelectLanguageBox"
import { pushMessage } from "@src/services/notification"
import { useTranslateService } from "@/src/providers/translateProvider"
import Constants from "expo-constants"
import { NostrEvent } from "@nostr-dev-kit/ndk"

const UserMenuScreen = ({ navigation }: any) => {

    const opacity = .7 
    const { user, setUser, setWallets, setEmptioData, setFollowsEvent } = useAuth()
    const { useTranslate } = useTranslateService()
    const [forceUpdate, setForceUpdate] = useState()
    const [loading, setLoading] = useState(false) 

    const handleCopySecretKey = async () => {
        const biometrics = await authService.checkBiometric()

        const { privateKey } = await getPairKey(user?.keychanges ?? "")

        if (biometrics) {
            const secretkey = nip19.nsecEncode(hexToBytes(privateKey))

            await setStringAsync(secretkey)

            pushMessage(useTranslate("message.copied"))
        }
    }

    const handleCopyPublicKey = async () => {
        const { publicKey } = await getPairKey(user?.keychanges ?? "")

        const pubKey = nip19.npubEncode(publicKey)

        await setStringAsync(pubKey)

        pushMessage(useTranslate("message.copied"))
    }

    const handleDeleteAccount = async () => {
        showMessage({
            title: useTranslate("message.profile.wantleave"),
            message: useTranslate("message.profile.alertleave"),
            action: {
                label: useTranslate("commons.exit"),
                onPress: async () => {
                    setLoading(true)
                    const result = await userService.signOut()

                    if (result.success) 
                    {
                        if(setUser) setUser({})
                        if(setWallets) setWallets([])
                        if(setEmptioData) setEmptioData({})
                        if(setFollowsEvent) setFollowsEvent({} as NostrEvent)
                        navigation.reset({ index: 0, routes: [{ name: "initial-stack" }] })
                    }
                    else {
                        pushMessage(result.message)
                        setLoading(false)
                    }
                }
            }
        })
    }

    if (loading)
        return <SplashScreen message="deleting storage.." />

    return (
        <>
            <ScrollView contentContainerStyle={theme.styles.scroll_container}>
                {/* <View style={styles.banner}> */}
                {/*     {user?.banner && <Image style={{ width: "100%", height: "100%" }} source={{ uri: user?.banner }} />}  */}
                {/* </View> */}
                {/* <View style={styles.banner}> */}
                {/*     <View style={styles.bunnerBlur}></View> */}
                {/* </View> */}
                <View style={{ height: 10 }}></View>
                <View style={styles.area}>
                    <View style={styles.profileArea}>
                        <TouchableOpacity activeOpacity={opacity} onPress={() => navigation.navigate("manage-account-stack")}>
                            <View style={styles.image}>
                                {user?.picture && <Image onError={() => user.picture = ""} source={{ uri: user?.picture }} style={{ flex: 1 }} />}
                                {!user?.picture && <Image source={require("assets/images/defaultProfile.png")} style={{ width: 97, height: 97 }} />}
                            </View> 
                        </TouchableOpacity>                
                    </View> 
                    <Text style={styles.name}>{user?.display_name ?? user.name}</Text>
                </View>

                <View style={styles.sectiontop}>
                    <TouchableOpacity style={styles.mediumsection} activeOpacity={opacity}>
                        <SectionContainer style={styles.mediumcontainer}>
                            <Ionicons name="people" color={theme.colors.white} size={theme.icons.large} />
                            <Text style={{ color: theme.colors.white, paddingVertical: 5 }}>{useTranslate("section.title.talkdevelopers")}</Text>
                            <Text style={{ color: theme.colors.gray, fontSize: 12 }}>{useTranslate("section.description.talkdevelopers")}</Text>
                        </SectionContainer>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.mediumsection} activeOpacity={opacity}>
                        <SectionContainer style={styles.mediumcontainer}>
                            <Ionicons name="paper-plane" color={theme.colors.white} size={theme.icons.large} />
                            <Text style={{ color: theme.colors.white, paddingVertical: 5 }}>{useTranslate("section.title.sharefriend")}</Text>
                            <Text style={{ color: theme.colors.gray, fontSize: 12 }}>{useTranslate("section.description.sharefriend")}</Text>
                        </SectionContainer>
                    </TouchableOpacity>
                </View>

                <SectionContainer style={{ backgroundColor: theme.colors.blueOpacity }}>
                    <LinkSection label={useTranslate("settings.account.edit")} icon="person" onPress={() => navigation.navigate("manage-account-stack")} />
                    <LinkSection label={useTranslate("settings.nostrkey.copy")} icon="document-lock-outline" onPress={handleCopyPublicKey} />
                    <LinkSection label={useTranslate("settings.secretkey.copy")} icon="document-lock-outline" onPress={handleCopySecretKey} />
                </SectionContainer>

                <SectionContainer style={{ backgroundColor: theme.colors.blueOpacity }}>
                    {/* <LinkSection label="Wallet" icon="settings" onPress={() => navigation.navigate("wallet-stack")} /> */}
                    <LinkSection label={useTranslate("settings.chooselanguage")} icon="language" onPress={showSelectLanguage} />
                    <LinkSection label={useTranslate("settings.relays")} icon="earth" onPress={() => navigation.navigate("manage-relays-stack")} />
                    <LinkSection label={useTranslate("settings.security")} icon="settings" onPress={() => navigation.navigate("manage-security-stack")} />
                    {/* <LinkSection label={useTranslate("settings.about")} icon="settings" onPress={() => navigation.navigate("about-stack")} /> */}
                </SectionContainer>

                <SectionContainer style={{ backgroundColor: theme.colors.blueOpacity }}>
                    <LinkSection label={useTranslate("settings.about")} icon="settings" onPress={() => navigation.navigate("about-stack")} />
                    <LinkSection label={useTranslate("commons.signout")} icon="exit" onPress={handleDeleteAccount} />
                </SectionContainer>


                {/* <View> */}
                {/*     <ButtonLink color={theme.colors.red} label={useTranslate("commons.signout")} onPress={handleDeleteAccount} /> */}
                {/* </View> */}
                <View style={{ height: 45 }}></View>

                <View style={{ flexDirection: "row", marginBottom: 40 }}>
                    <Text style={{ textAlign: "center", color: theme.colors.gray, fontWeight: "400", fontSize: 14 }}>version {Constants.expoConfig?.version}</Text>
                </View>

            </ScrollView>
            <SelectLanguageBox forceUpdate={setForceUpdate} />
            <View key={forceUpdate}></View>
            <MessageBox />
        </>
    )
}

const styles = StyleSheet.create({
    mediumcontainer: { padding: 10, paddingVertical: 20, height: "auto", backgroundColor: theme.colors.blueOpacity },
    sectiontop: { width: "96%", flexDirection: "row", alignItems: "center", paddingVertical: 4 },
    mediumsection: { width: "50%", alignItems: "center", height: "100%" },
    area: { width: "100%", alignItems: "center", marginVertical: 10 },
    name: { fontSize: 18, fontWeight: 'bold', color: theme.colors.white, marginVertical: 10 },
    profileArea: { width: 100, height: 100, borderRadius: 50, backgroundColor: theme.colors.black },
    image: { width: 100, height: 100, borderRadius: 50, overflow: "hidden", borderWidth: 3, borderColor: theme.colors.blue, backgroundColor: theme.colors.black },
    banner: { width: "96%", height: 145, borderRadius: 20, overflow: "hidden", position: "absolute", top: 0 },
    bunnerBlur: { flex: 1, backgroundColor: theme.colors.semitransparent }
})

export default UserMenuScreen
