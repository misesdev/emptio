import { StyleSheet, View, TouchableOpacity, Image } from "react-native"
import { useTranslateService } from "@src/providers/TranslateProvider"
import { useAccount } from "@src/context/AccountContext"
import { ButtonPrimary } from "@components/form/Buttons"
import { FormControl } from "@components/form/FormControl"
import { ScrollView } from "react-native-gesture-handler"
import Ionicons from 'react-native-vector-icons/Ionicons'
import useUpdateUser from "../hooks/useUpdateUser"
import theme from "@src/theme"
import { useState } from "react"

const UserEditScreen = () => {

    const { useTranslate } = useTranslateService()
    const { user, setUser } = useAccount()
    const [pictureError, setPictureError] = useState(false)
    const { 
        name, setName, profileColor, profileUri, bannerUri, 
        about, setAbout, website, setWebsite, lnAddress, setLnAddress,
        loading, disabled, pickImage, onSave
    } = useUpdateUser({ user, setUser })

    return (
        <ScrollView contentContainerStyle={[theme.styles.scroll_container, { paddingVertical: 20 }]} >
            <View style={styles.banner}>
                {bannerUri && <Image style={{ flex: 1 }} source={{ uri: bannerUri }} />}
                <TouchableOpacity
                    onPress={() => pickImage("banner")}
                    style={styles.buttonBanner}
                >
                    <Ionicons name="pencil" color={theme.colors.white} size={theme.icons.mine} />
                </TouchableOpacity>
            </View>
            <View style={{ height: 60 }}></View>
            <View style={styles.profileArea}>
                <View style={styles.imageArea}>
                    <TouchableOpacity activeOpacity={.7} onPress={() => pickImage("profile")}>
                        <View style={[styles.image,{borderColor:profileColor}]}>
                            <Image style={{ width: 96, height: 96 }}
                                onError={() => setPictureError(true)}
                                source={(pictureError || !profileUri) ? require("@assets/images/defaultProfile.png")
                                    : { uri: profileUri }
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

            <FormControl 
                value={name} 
                onChangeText={setName}
                label={useTranslate("labels.username")}
            />
            <FormControl 
                isTextArea
                value={about} 
                onChangeText={setAbout} 
                label={useTranslate("labels.about")} 
            />
            <FormControl
                value={website}
                onChangeText={setWebsite}
                label={useTranslate("labels.mywebsite")}
            />
            <FormControl 
                value={lnAddress} 
                onChangeText={setLnAddress}
                label={useTranslate("labels.lnaddress")} 
            />

            <ButtonPrimary
                style={{ marginTop: 50 }} 
                label={useTranslate("commons.save")}
                onPress={onSave} 
                disabled={disabled}
                loading={loading} 
            />
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
