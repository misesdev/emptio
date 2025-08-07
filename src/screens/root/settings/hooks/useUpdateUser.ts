import { useService } from "@src/providers/ServiceProvider";
import { useTranslateService } from "@src/providers/TranslateProvider";
import { launchImageLibrary } from "react-native-image-picker";
import { pushMessage } from "@services/notification";
import { Utilities } from "@src/utils/Utilities";
import { User } from "@services/user/types/User"
import { useEffect, useState } from "react"
import theme from "@src/theme";

type Props = {
    user: User;
    setUser: (u: User) => void;
}

const useUpdateUser = ({ user, setUser }: Props) => {

    const [loading, setLoading] = useState(false)
    const [about, setAbout] = useState(user.about)
    const [bannerUri, setBannerUri] = useState(user.banner)
    const [bannerMimeType, setBannerMimeType] = useState("")
    const [name, setName] = useState(user.name)
    const [website, setWebsite] = useState(user.website)
    const [lnAddress, setLnAddress] = useState(user.lud16)
    const [profileUri, setProfileUri] = useState(user.picture)
    const [profileMimeType, setProfileMimeType] = useState("")
    const [profileColor, setProfileColor] = useState(theme.colors.green)
    const [disabled, setDisabled] = useState(false)
    const { userService, blobService } = useService()
    const { useTranslate } = useTranslateService()
    
    useEffect(() => {
        setProfileColor(Utilities.getColorFromPubkey(user.pubkey))
    },[])

    const pickImage = async (location: "profile" | "banner") => {
        // allow to user select a image of your galery
        launchImageLibrary({
            mediaType: "photo",
            selectionLimit: 1
        }, (result) => {
            if (!result.didCancel) {
                if (location == "banner" && result.assets) {
                    setBannerUri(result.assets[0].uri)
                    setBannerMimeType(result.assets[0].type??"image/jpeg")
                } else if(result.assets) {
                    setProfileUri(result.assets[0].uri)
                    setProfileMimeType(result.assets[0].type??"image/jpeg")
                }
            }
        })
    }

    const onSave = async () => {
        setLoading(true)
        setDisabled(true)
        user.about = about
        user.name = name
        user.website = website
        user.lud16 = lnAddress
        // upload image of banner
        if (bannerUri && bannerUri != user.banner) {
            const result = await blobService.upload({
                mimeType: bannerMimeType,
                localUri: bannerUri
            })
            if(result.success && result.data) 
                user.banner = result.data
        }
        // upload image of profile
        if (profileUri && profileUri != user.picture) {
            const result = await blobService.upload({
                mimeType: profileMimeType,
                localUri: profileUri
            }) 
            if(result.success && result.data) 
                user.picture = result.data
        }

        await userService.updateProfile({ 
            upNostr: true, 
            setUser, 
            user
        })

        pushMessage(useTranslate("message.profile.saved"))
        setDisabled(false)
        setLoading(false)
    }

    return {
        name,
        setName,
        profileUri,
        bannerUri,
        profileColor,
        about,
        setAbout,
        website,
        setWebsite,
        lnAddress,
        setLnAddress,
        loading,
        disabled,
        pickImage,
        onSave
    }
}

export default useUpdateUser
