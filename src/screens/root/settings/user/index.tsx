
import { StyleSheet, View, TouchableOpacity, Image } from "react-native"
import { launchImageLibrary } from "react-native-image-picker"
import { useAuth } from "@src/providers/userProvider"
import { ButtonPrimary } from "@components/form/Buttons"
import { FormControl } from "@components/form/FormControl"
import { ScrollView } from "react-native-gesture-handler"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { userService } from "@src/core/userManager"
import SplashScreen from "@components/general/SplashScreen"
import { uploadImage } from "@services/blob"
import { pushMessage } from "@services/notification"
import { useTranslateService } from "@src/providers/translateProvider"
import { useEffect, useState } from "react"
import theme from "@src/theme"
import { StackScreenProps } from "@react-navigation/stack"
import { getColorFromPubkey } from "@/src/utils"

const UserEditScreen = ({ navigation }: StackScreenProps<any>) => {

    const { user, setUser } = useAuth()
    const [loading, setLoading] = useState(false)
    const [about, setAbout] = useState(user.about)
    const [banner, setBanner] = useState(user.banner)
    const [userName, setUserName] = useState(user.name)
    const [myWebsite, setMyWebsite] = useState(user.website)
    const [lnAddress, setLnAddress] = useState(user.lud16)
    const [profile, setProfile] = useState(user.picture)
    const [profileColor, setProfileColor] = useState(theme.colors.green)
    const [pictureError, setPictureError] = useState(false)
    const { useTranslate } = useTranslateService()
    
    useEffect(() => {
        setProfileColor(getColorFromPubkey(user.pubkey??""))
    },[])

    const handlePickImage = async (location: "profile" | "banner") => {
        // allow to user select a image of your galery
        launchImageLibrary({
            mediaType: "photo",
            selectionLimit: 1
        }, (result) => {
            if (!result.didCancel) {
                if (location == "banner" && result.assets)
                    setBanner(result.assets[0].uri)
                else if(result.assets)
                    setProfile(result.assets[0].uri)

            //await uploadImage(result.assets[0].uri)
        }})
    }

    const handleSave = async () => {

        user.about = about
        user.name = userName
        user.website = myWebsite
        user.lud16 = lnAddress

        setLoading(true)

        // upload image of banner
        if (banner && banner != user.banner) {

        }

        // upload image of profile
        if (profile && profile != user.picture) {

        }

        await userService.updateProfile({ user, setUser, upNostr: true })

        setLoading(false)

        pushMessage(useTranslate("message.profile.saved"))
    }

    if (loading)
        return <SplashScreen />

    return (
        <ScrollView contentContainerStyle={[theme.styles.scroll_container, { paddingVertical: 20 }]} >
            <View style={styles.banner}>
                {banner && <Image style={{ flex: 1 }} source={{ uri: banner }} />}
                <TouchableOpacity
                    onPress={() => handlePickImage("banner")}
                    style={styles.buttonBanner}
                >
                    <Ionicons name="pencil" color={theme.colors.white} size={theme.icons.mine} />
                </TouchableOpacity>
            </View>
            <View style={{ height: 60 }}></View>
            <View style={styles.profileArea}>
                <View style={styles.imageArea}>
                    <TouchableOpacity activeOpacity={.7} onPress={() => handlePickImage("profile")}>
                        <View style={[styles.image,{borderColor:profileColor}]}>
                            <Image style={{ width: 96, height: 96 }}
                                onError={() => setPictureError(true)}
                                source={(pictureError || !profile) ? require("@assets/images/defaultProfile.png")
                                    : { uri: profile }
                                }  
                            />
                        </View>
                        <Ionicons
                            size={theme.icons.mine}
                            color={theme.colors.white}
                            name="pencil-outline"
                            style={styles.buttonProfile}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <FormControl label={useTranslate("labels.username")} value={userName} onChangeText={setUserName} />
            <FormControl label={useTranslate("labels.about")} value={about} onChangeText={setAbout} isTextArea />
            <FormControl label={useTranslate("labels.mywebsite")} value={myWebsite} onChangeText={setMyWebsite} />
            <FormControl label={useTranslate("labels.lnaddress")} value={lnAddress} onChangeText={setLnAddress} />

            <ButtonPrimary style={{ marginTop: 50 }} label={useTranslate("commons.save")} onPress={handleSave} />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    imageArea: { width: 100, height: 100, borderRadius: 50, backgroundColor: theme.colors.black },
    image: { width: 100, height: 100, borderRadius: 50, backgroundColor: theme.colors.black, 
        borderWidth: 2, overflow: "hidden" },
    profileArea: { width: "100%", alignItems: "center", marginVertical: 10, marginBottom: 20 },
    banner: { width: "100%", height: 140, position: "absolute", top: 0 },
    buttonBanner: { position: "absolute", top: 14, right: 12, 
        backgroundColor: theme.colors.default, padding: 10, borderRadius: 10 },
    buttonProfile: { position: "absolute", padding: 5, bottom: 5, right: 5, zIndex: 999, 
        backgroundColor: theme.colors.default, borderRadius: 15 }
})

export default UserEditScreen
