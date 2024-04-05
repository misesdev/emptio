import { User } from "@src/services/memory/types"
import { memo, useEffect, useState } from "react"
import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native"
import theme from "@src/theme"
import { getEvent, listenerEvents } from "@src/services/nostr/events"

type UserItemProps = {
    follow: User
}

const FollowItem = ({ follow }: UserItemProps) => {

    const [followData, setUserData] = useState<User>(follow)

    useEffect(() => {
        loadProfile()
    }, [])

    const loadProfile = async () => {
        
        console.log("buscando: ", follow.pubkey)
        let event = await getEvent({ kinds: [0], authors: [followData.pubkey ?? ""] })
        
        if(event) 
            setUserData({ ...event.content, pubkey: event.pubkey })
        else 
            console.log("Não encontrado: ", follow.pubkey)
    }

    const handleClickUser = (user: User) => {

    }

    var userName: string = followData.name ?? followData.display_name ?? followData.displayName ?? ""
    var userAbout: string = followData.about ?? "Profile not founded data!"
    
    if (userName.length > 24)
        userName = `${userName?.substring(0, 23)}...`

    if (userAbout)
        userAbout = userAbout.length > 80 ? `${userAbout.substring(0, 80)}...` : userAbout

    if(!userName)
        return <></>

    return (
        <TouchableOpacity style={styles.sectionUser} onPress={() => handleClickUser(followData)} key={followData.pubkey} activeOpacity={.7}>
            {/* Transaction Type */}
            <View style={{ width: "20%", minHeight: 75, justifyContent: "center", alignItems: "center" }}>
                <View style={styles.profileView}>
                    {followData.picture && <Image source={{ uri: followData.picture }} style={styles.profile} />}
                    {!followData.picture && <Image source={require("assets/images/defaultProfile.png")} style={styles.profileView} />}
                </View>
            </View>
            {/* Transaction Description and Date */}
            <View style={{ width: "80%", minHeight: 75 }}>
                <View style={{ width: "100%" }}>
                    <Text style={{ color: theme.colors.white, fontFamily: "", fontSize: 14, fontWeight: "600", margin: 2, marginTop: 12 }}>
                        {userName}
                    </Text>
                </View>
                <View style={{ width: "100%" }}>
                    <Text style={{ fontSize: 12, color: theme.colors.gray, margin: 2, paddingRight: 8, paddingBottom: 8, fontWeight: "bold" }}>
                        {userAbout}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    profile: {
        flex: 1,
    },
    profileView: {
        width: 50,
        height: 50,
        borderRadius: 50,
        overflow: 'hidden'
    },
    sectionUser: {
        width: "96%",
        minHeight: 75,
        maxHeight: 120,
        borderRadius: 23,
        marginVertical: 4,
        flexDirection: "row",
        backgroundColor: "rgba(0, 55, 55, .2)"
    }
})

export default FollowItem