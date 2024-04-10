
import { StyleSheet, View, TouchableOpacity, Image } from "react-native"
import { MediaTypeOptions, launchImageLibraryAsync, requestMediaLibraryPermissionsAsync } from "expo-image-picker"
import { useAuth } from "@src/providers/userProvider"
import { useTranslate } from "@src/services/translate"
import AlertBox, { alertMessage } from "@components/general/AlertBox"
import { ButtonPrimary } from "@components/form/Buttons"
import { FormControl } from "@components/form/FormControl"
import { ScrollView } from "react-native-gesture-handler"
import { Ionicons } from "@expo/vector-icons"
import { useEffect, useState } from "react"
import { userService } from "@src/core/userManager"
import SplashScreen from "@components/general/SplashScreen"
import theme from "@src/theme"
import { uploadImage } from "@/src/services/blob"

const UserEditScreen = ({ navigation }: any) => {

    const { user, setUser } = useAuth()
    const [loading, setLoading] = useState(false)
    const [about, setAbout] = useState(user.about)
    const [banner, setBanner] = useState(user.banner)
    const [userName, setUserName] = useState(user.name)
    const [myWebsite, setMyWebsite] = useState(user.website)
    const [lnAddress, setLnAddress] = useState(user.lud16)
    const [prifile, setProfile] = useState(user.picture)

    useEffect(() => {
        (async () => {
            const { status } = await requestMediaLibraryPermissionsAsync()
            if (status !== 'granted')
                alertMessage(useTranslate("message.error.notaccessgallery"))
        })
    }, [])

    const handlePickImage = async (location: "profile" | "banner") => {
        // allow to user select a image of your galery
        let result = await launchImageLibraryAsync({
            mediaTypes: MediaTypeOptions.Images,
            allowsMultipleSelection: false,
            allowsEditing: true,
            aspect: location == "profile" ? [4, 4] : [4, 2],
            quality: 1
        })

        if (!result.canceled) {
            if (location == "banner")
                setBanner(result.assets[0].uri)
            else
                setProfile(result.assets[0].uri)

            await uploadImage(result.assets[0].uri)
        }
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
        if (prifile && prifile != user.picture) {

        }

        await userService.updateProfile({ user, setUser, upNostr: true })

        setLoading(false)

        alertMessage(useTranslate("message.profile.saved"))
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
                <TouchableOpacity activeOpacity={.7} onPress={() => handlePickImage("profile")}>
                    <View style={styles.image}>
                        {prifile && <Image source={{ uri: prifile }} style={styles.picture} />}
                        {!prifile && <Image source={require("assets/images/defaultProfile.png")} style={styles.picture} />}
                    </View>
                    <Ionicons
                        size={theme.icons.mine}
                        color={theme.colors.white}
                        name="pencil-outline"
                        style={styles.buttonProfile}
                    />
                </TouchableOpacity>
            </View>

            <FormControl label={useTranslate("labels.username")} value={userName} onChangeText={setUserName} />
            <FormControl label={useTranslate("labels.about")} value={about} onChangeText={setAbout} isTextArea />
            <FormControl label={useTranslate("labels.mywebsite")} value={myWebsite} onChangeText={setMyWebsite} />
            <FormControl label={useTranslate("labels.lnaddress")} value={lnAddress} onChangeText={setLnAddress} />

            <ButtonPrimary label={useTranslate("commons.save")} onPress={handleSave} />
            <AlertBox />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    image: { width: 100, height: 100, borderRadius: 50, backgroundColor: theme.colors.gray },
    profileArea: { width: "100%", alignItems: "center", marginVertical: 10, marginBottom: 20 },
    picture: { zIndex: 99, width: "100%", height: "100%", borderRadius: 50, borderWidth: 2, borderColor: theme.colors.section },
    banner: { width: "100%", height: 140, position: "absolute", top: 0, zIndex: 0 },
    buttonBanner: { position: "absolute", top: 10, right: 10, backgroundColor: theme.colors.default, padding: 10, borderRadius: 10 },
    buttonProfile: { position: "absolute", padding: 5, bottom: 5, right: 5, zIndex: 999, backgroundColor: theme.colors.default, borderRadius: 15 }
})

export default UserEditScreen