

import { useState } from "react"
import { Modal, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native"
import { useTranslateService } from "@src/providers/translateProvider"
import theme from "@src/theme"
import { BlurView } from "expo-blur"
import { User } from "@/src/services/memory/types"
import { hexToNpub } from "@/src/services/converter"
import { useAuth } from "@/src/providers/userProvider"

type followModalProps = {
    user: User,
}

type ButtonProps = {
    label: string,
    onPress: () => void,
}

var showFollowModalFunction: (config: followModalProps) => void

const ButtonLight = ({ label, onPress }: ButtonProps) => {
    const [backColor, setBackColor] = useState(theme.colors.transparent)
    return (
        <TouchableOpacity onPress={onPress}
            onPressIn={() => setBackColor("rgba(255, 255, 255, .2)")}
            onPressOut={() => setBackColor(theme.colors.transparent)}
            style={{ padding: 10, paddingHorizontal: 15, borderRadius: 8, backgroundColor: backColor }}
        >
            <Text style={{ fontSize: 14, fontWeight: "bold", color: theme.colors.white }}>{label}</Text>
        </TouchableOpacity>
    )
}

type FollowProps = {
    handleAddFollow: (user: User) => void
}

const FollowModal = ({ handleAddFollow }: FollowProps) => {

    const { followsEvent } = useAuth()
    const [user, setUser] = useState<User>()
    const [isFriend, setIsFriend] = useState(false)
    const [visible, setVisible] = useState(false)
    const { useTranslate } = useTranslateService()

    showFollowModalFunction = ({ user }: followModalProps) => {
        setUser(user)
        setIsFriend(!!followsEvent?.tags.filter(f => f[0] == "p" && f[1] == user.pubkey).length)
        setVisible(true)
    }

    const handleClose = () => {
        setVisible(false)
    }

    const handleAction = () => {
        handleAddFollow(user ?? {})

        setVisible(false)
    }

    return (
        <Modal animationType="fade" onRequestClose={handleClose} visible={visible} transparent >
            <BlurView intensity={75} tint="dark" style={styles.absolute}>
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0, .6)" }}>
                    <View style={styles.box}>

                        <View style={{ flexDirection: "row" }}>
                            <TouchableOpacity activeOpacity={.3}>
                                <View style={styles.image}>
                                    {user?.picture && <Image source={{ uri: user?.picture }} style={{ flex: 1 }} />}
                                    {!user?.picture && <Image source={require("assets/images/defaultProfile.png")} style={{ flex: 1 }} />}
                                </View>
                            </TouchableOpacity>
                            <View style={{ paddingHorizontal: 12 }}>
                                <Text style={{ color: theme.colors.white, fontSize: 20, fontWeight: 'bold' }}>
                                    {user?.display_name?.substring(0, 18)}
                                </Text>
                                <Text style={{ fontSize: 14, fontWeight: "500", color: theme.colors.gray }}>
                                    {hexToNpub(user?.pubkey ?? "").substring(0, 25)}..
                                </Text>
                            </View>
                        </View>
                        
                        <View style={{ width: "100%", marginTop: 10, marginBottom: 10 }}>
                            <Text style={styles.message}>{user?.about}</Text>
                        </View>

                        {isFriend && <Text style={styles.infolog}>
                            <Text style={{ color: theme.colors.gray, fontWeight: "500" }}>
                                {user?.display_name?.substring(0, 14)}  
                            </Text> {' '}
                            {useTranslate("message.friend.already")}
                        </Text>}

                        <View style={styles.sectionButtons}>
                            {!isFriend && <ButtonLight label={useTranslate("commons.add")} onPress={handleAction} />}
                            <ButtonLight label={useTranslate("commons.close")} onPress={handleClose} />
                        </View>

                    </View>
                </View>
            </BlurView>
        </Modal>
    )
}

export const showFollowModal = (props: followModalProps) => {
     showFollowModalFunction(props) 
}

const styles = StyleSheet.create({
    box: { padding: 10, paddingHorizontal: 15, width: "85%", borderRadius: 8, backgroundColor: theme.colors.section },
    message: { fontSize: 14, color: theme.colors.gray },
    infolog: { paddingHorizontal: 15, paddingVertical: 8, marginVertical: 18, borderRadius: 10, backgroundColor: theme.colors.semitransparent, color: theme.colors.gray },
    image: { width: 60, height: 60, borderRadius: 50, overflow: "hidden", borderWidth: 1, borderColor: theme.colors.blue },
    sectionButtons: { width: "100%", flexDirection: "row-reverse" },
    absolute: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    }
})

export default FollowModal
