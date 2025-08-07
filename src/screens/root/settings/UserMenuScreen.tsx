import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from "react-native"
import { LinkSection, SectionContainer } from "@components/general/section"
import SelectLanguageBox, { showSelectLanguage } from "@components/modal/SelectLanguageBox"
import { ProfilePicture } from "@components/nostr/user/ProfilePicture"
import { useTranslateService } from "@src/providers/TranslateProvider"
import Ionicons from 'react-native-vector-icons/Ionicons'
import MessageBox from "@components/general/MessageBox"
import { useAccount } from "@src/context/AccountContext"
import ShareAppBar from "./commons/ShareAppBar"
import useMenu from "./hooks/useMenu"
import theme from "@src/theme"

const UserMenuScreen = ({ navigation }: any) => {

    const { user } = useAccount()
    const { 
        appVersion, poolstats, forceUpdate, setForceUpdate, shareVisible, setShareVisible,
        copyPublicKey, copySecretKey, deleteAccount
    } = useMenu()

    const { useTranslate } = useTranslateService()

    return (
        <View style={{ flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false} 
                contentContainerStyle={theme.styles.scroll_container}
            >
                <View style={{ height: 60 }}></View>
                <View style={styles.area}>
                    <View style={styles.profileArea}>
                        <TouchableOpacity activeOpacity={.7} 
                            onPress={() => navigation.navigate("manage-account")}
                        >
                            <ProfilePicture user={user} size={100} />
                        </TouchableOpacity>                
                    </View> 
                    <Text style={styles.name}>{user?.display_name ?? user.name}</Text>
                </View>

                <View style={styles.sectiontop}>
                    <TouchableOpacity style={styles.mediumsection} activeOpacity={.7} 
                        onPress={() => navigation.navigate("friends-list")}
                    >
                        <SectionContainer style={styles.mediumcontainer}>
                            <Ionicons name="people" color={theme.colors.white} size={theme.icons.large} />
                            <Text style={{ color: theme.colors.white, paddingVertical: 5 }}>{useTranslate("section.title.managefriends")}</Text>
                            <Text style={{ color: theme.colors.gray, fontSize: 12 }}>{useTranslate("section.description.managefriends")}</Text>
                        </SectionContainer>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.mediumsection} 
                        activeOpacity={.7} onPress={() => setShareVisible(true)}
                    >
                        <SectionContainer style={styles.mediumcontainer}>
                            <Ionicons name="paper-plane" color={theme.colors.white} size={theme.icons.large} />
                            <Text style={{ color: theme.colors.white, paddingVertical: 5 }}>{useTranslate("section.title.sharefriend")}</Text>
                            <Text style={{ color: theme.colors.gray, fontSize: 12 }}>{useTranslate("section.description.sharefriend")}</Text>
                        </SectionContainer>
                    </TouchableOpacity>
                </View>

                <SectionContainer style={{ backgroundColor: theme.colors.blueOpacity }}>
                    <LinkSection label={useTranslate("settings.account.edit")} icon="person" onPress={() => navigation.navigate("manage-account")} />
                    <LinkSection label={useTranslate("settings.nostrkey.copy")} icon="document-lock-outline" onPress={copyPublicKey} />
                    <LinkSection label={useTranslate("settings.secretkey.copy")} icon="document-lock-outline" onPress={copySecretKey} />
                </SectionContainer>

                <SectionContainer style={{ backgroundColor: theme.colors.blueOpacity }}>
                    <LinkSection icon="language" 
                        label={useTranslate("settings.chooselanguage")} 
                        onPress={showSelectLanguage} 
                    />
                    <LinkSection icon="earth"
                        label={useTranslate("settings.relays")+` (${poolstats?.connected}/${poolstats?.total})`} 
                        onPress={() => navigation.navigate("manage-relays")} 
                    />
                    <LinkSection icon="settings" 
                        label={useTranslate("settings.security")} 
                        onPress={() => navigation.navigate("manage-security")} 
                    />
                </SectionContainer>

                <SectionContainer style={{ backgroundColor: theme.colors.blueOpacity }}>
                    <LinkSection label={useTranslate("settings.about")} icon="settings" onPress={() => navigation.navigate("about")} />
                    <LinkSection label={useTranslate("commons.signout")} icon="exit" onPress={deleteAccount} />
                </SectionContainer>

     
                <View style={{ height: 45 }}></View>

                <View style={{ flexDirection: "row", marginBottom: 40 }}>
                    <Text style={{ textAlign: "center", color: theme.colors.gray, fontWeight: "400", fontSize: 14 }}>
                        {useTranslate("commons.version")} {appVersion}
                    </Text>
                </View>

            </ScrollView>
            <SelectLanguageBox forceUpdate={setForceUpdate} />
            <ShareAppBar visible={shareVisible} setVisible={setShareVisible} />
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
