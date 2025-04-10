import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from "react-native"
import { LinkSection, SectionContainer } from "@components/general/section"
import { useAuth } from "@src/providers/userProvider"
import { hexToBytes } from "@noble/hashes/utils"
import Ionicons from 'react-native-vector-icons/Ionicons'
import MessageBox, { showMessage } from "@components/general/MessageBox"
import SelectLanguageBox, { showSelectLanguage } from "@components/modal/SelectLanguageBox"
import { pushMessage } from "@services/notification"
import { useTranslateService } from "@src/providers/translateProvider"
import { NostrEvent } from "@nostr-dev-kit/ndk"
import { copyToClipboard } from "@src/utils"
import DeviceInfo from 'react-native-device-info'
import { StackScreenProps } from "@react-navigation/stack"
import AppShareBar from "./commons/shareapp"
import { ProfilePicture } from "@components/nostr/user/ProfilePicture"
import { authService } from "@services/auth"
import { useEffect, useState } from "react"
import { nip19 } from "nostr-tools";
import theme from "@src/theme"
import { userService } from "@services/user"
import useNDKStore from "@services/zustand/ndk"
import { NDKRelay } from "@nostr-dev-kit/ndk-mobile"
import { storageService } from "@services/memory"

const UserMenuScreen = ({ navigation }: StackScreenProps<any>) => {

    const opacity = .7 
    const { ndk } = useNDKStore()
    const appVersion = DeviceInfo.getVersion()
    const { user, setUser, setWallets, setFollows, setFollowsEvent } = useAuth()
    const { useTranslate } = useTranslateService()
    const [forceUpdate, setForceUpdate] = useState()
    const [shareVisible, setShareVisible] = useState(false)
    const [poolstats, setPoolstats] = useState<any>({})

    useEffect(() => {
        const relays: NDKRelay[] = Array.from(ndk.pool.relays.values())
        if(poolstats.connected != relays.filter(r => r.connected).length) {
            setPoolstats({
                total: relays.length,
                connected: relays.filter(r => r.connected).length
            })
        }
    }, [ndk])

    const handleCopySecretKey = async () => {
        const biometrics = await authService.checkBiometric()
        
        if (biometrics) {
            const { privateKey } = await storageService.secrets.getPairKey(user?.keychanges ?? "")
            const secretkey = nip19.nsecEncode(hexToBytes(privateKey))
            copyToClipboard(secretkey)
        }
    }

    const handleCopyPublicKey = async () => {
        const { publicKey } = await storageService.secrets.getPairKey(user?.keychanges ?? "")

        const pubKey = nip19.npubEncode(publicKey)

        copyToClipboard(pubKey)
    }

    const handleDeleteAccount = async () => {
        
        const deleteAccount = async () => {
            const result = await userService.signOut()

            if (result.success) 
            {
                if(setUser) setUser({})
                if(setWallets) setWallets([])
                if(setFollows) setFollows([])
                if(setFollowsEvent) setFollowsEvent({} as NostrEvent)
                navigation.reset({ index: 0, routes: [{ name: "initial-stack" }] })
            }
            else if(result.message) 
                pushMessage(result.message)
        }

        showMessage({
            title: useTranslate("message.profile.wantleave"),
            message: useTranslate("message.profile.alertleave"),
            action: {
                label: useTranslate("commons.exit"),
                onPress: deleteAccount
            }
        })
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false} 
                contentContainerStyle={theme.styles.scroll_container}
            >
                <View style={{ height: 60 }}></View>
                <View style={styles.area}>
                    <View style={styles.profileArea}>
                        <TouchableOpacity activeOpacity={opacity} onPress={() => navigation.navigate("manage-account-stack")}>
                            <ProfilePicture user={user} size={100} />
                        </TouchableOpacity>                
                    </View> 
                    <Text style={styles.name}>{user?.display_name ?? user.name}</Text>
                </View>

                <View style={styles.sectiontop}>
                    <TouchableOpacity style={styles.mediumsection} 
                        activeOpacity={opacity} onPress={() => navigation.navigate("friends-list-stack")}
                    >
                        <SectionContainer style={styles.mediumcontainer}>
                            <Ionicons name="people" color={theme.colors.white} size={theme.icons.large} />
                            <Text style={{ color: theme.colors.white, paddingVertical: 5 }}>{useTranslate("section.title.managefriends")}</Text>
                            <Text style={{ color: theme.colors.gray, fontSize: 12 }}>{useTranslate("section.description.managefriends")}</Text>
                        </SectionContainer>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.mediumsection} 
                        activeOpacity={opacity} onPress={() => setShareVisible(true)}
                    >
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
                    <LinkSection icon="language" 
                        label={useTranslate("settings.chooselanguage")} 
                        onPress={showSelectLanguage} 
                    />
                    <LinkSection icon="earth"
                        label={useTranslate("settings.relays")+` (${poolstats?.connected}/${poolstats?.total})`} 
                        onPress={() => navigation.navigate("manage-relays-stack")} 
                    />
                    <LinkSection icon="settings" 
                        label={useTranslate("settings.security")} 
                        onPress={() => navigation.navigate("manage-security-stack")} 
                    />
                    {/* <LinkSection label={useTranslate("settings.about")} icon="settings" onPress={() => navigation.navigate("about-stack")} /> */}
                </SectionContainer>

                <SectionContainer style={{ backgroundColor: theme.colors.blueOpacity }}>
                    <LinkSection label={useTranslate("settings.about")} icon="settings" onPress={() => navigation.navigate("about-stack")} />
                    <LinkSection label={useTranslate("commons.signout")} icon="exit" onPress={handleDeleteAccount} />
                </SectionContainer>

     
                <View style={{ height: 45 }}></View>

                <View style={{ flexDirection: "row", marginBottom: 40 }}>
                    <Text style={{ textAlign: "center", color: theme.colors.gray, fontWeight: "400", fontSize: 14 }}>
                        {useTranslate("commons.version")} {appVersion}
                    </Text>
                </View>

            </ScrollView>
            <SelectLanguageBox forceUpdate={setForceUpdate} />
            <AppShareBar visible={shareVisible} setVisible={setShareVisible} />
            <View key={forceUpdate}></View>
            <MessageBox />
        </View>
    )
}

const styles = StyleSheet.create({
    mediumcontainer: { padding: 10, paddingVertical: 20, height: "auto", backgroundColor: theme.colors.blueOpacity },
    sectiontop: { width: "96%", flexDirection: "row", alignItems: "center", paddingVertical: 4 },
    mediumsection: { width: "50%", alignItems: "center", height: "100%" },
    area: { width: "100%", alignItems: "center", marginVertical: 10 },
    name: { fontSize: 18, fontWeight: 'bold', color: theme.colors.white, marginVertical: 10 },
    profileArea: { width: 100, height: 100, borderRadius: 50, backgroundColor: theme.colors.black },
    image: { width: 100, height: 100, borderRadius: 50, overflow: "hidden", borderWidth: 3, 
        backgroundColor: theme.colors.black },
    banner: { width: "96%", height: 145, borderRadius: 20, overflow: "hidden", position: "absolute", top: 0 },
    bunnerBlur: { flex: 1, backgroundColor: theme.colors.semitransparent }
})

export default UserMenuScreen
