import { useState } from "react"
import { Modal, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native"
import { useTranslateService } from "@src/providers/translateProvider"
import { User } from "@services/memory/types"
import { userService } from "@src/core/userManager"
import { NoteList } from "../user/NoteList"
import { ActivityIndicator } from "react-native-paper"
import Ionicons from "react-native-vector-icons/Ionicons"
import { copyPubkey, getDisplayPubkey, getUserName } from "@src/utils"
import { NDKEvent } from "@nostr-dev-kit/ndk-mobile"
import theme from "@src/theme"

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
    handleAddFollow: (user: User) => Promise<void>
}

const FollowModal = ({ handleAddFollow }: FollowProps) => {

    const [user, setUser] = useState<User>()
    const [notes, setNotes] = useState<NDKEvent[]>([])
    const [visible, setVisible] = useState(false)
    const [loading, setloading] = useState(true)
    const { useTranslate } = useTranslateService()

    showFollowModalFunction = async ({ user }: followModalProps) => {
        setUser(user)
        setloading(true)
        setVisible(true)
        setNotes(await userService.lastNotes(user, 6))
        setloading(false)
    }

    const handleClose = () => {
        setVisible(false)
        setNotes([])
    }

    const handleAction = async () => {
        handleAddFollow(user as User)
        setVisible(false)
        setNotes([])
    }

    return (
        <Modal animationType="fade" onRequestClose={handleClose} visible={visible} transparent >
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: theme.colors.black }}>
                <View style={styles.box}>

                    <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity activeOpacity={.3} onPress={() => {}}>
                            <View style={styles.image}>
                                {user?.picture && <Image onError={() => user.picture = ""} source={{ uri: user?.picture }} style={{ flex: 1 }} />}
                                {!user?.picture && <Image source={require("@assets/images/defaultProfile.png")} style={{ width: 60, height: 60 }} />}
                            </View>
                        </TouchableOpacity>
                        <View style={{ paddingHorizontal: 12 }}>
                            <Text style={{ color: theme.colors.white, fontSize: 20, fontWeight: 'bold' }}>
                                {getUserName(user ?? {})}
                            </Text>
                            <TouchableOpacity activeOpacity={.7}
                                onPress={() => copyPubkey(user?.pubkey ?? "")}
                                style={{ flexDirection: "row" }}
                            >
                                <Text style={{ fontSize: 14, fontWeight: "500", color: theme.colors.gray }}>
                                    {getDisplayPubkey(user?.pubkey ?? "", 20)}
                                </Text>
                                <Ionicons name="copy" size={10} style={{ padding: 5 }} color={theme.colors.gray} />
                            </TouchableOpacity>
                        </View>
                    </View>
                                          
                    {user?.friend && <Text style={styles.infolog}>
                        <Text style={{ color: theme.colors.blue, fontWeight: "500" }}>
                            {getUserName(user)}  
                        </Text> {' '}
                        {useTranslate("message.friend.already")}
                    </Text>}

                    <Text style={{ margin: 10, fontWeight: "500", color: theme.colors.white }}>
                        {useTranslate("friends.notes.lasts")}
                    </Text>
                    
                    {notes?.length > 0 && <NoteList isVisible={visible} user={user} notes={notes} /> }
                    {notes?.length <= 0 && loading && <ActivityIndicator color={theme.colors.gray} size={34} />}
                    {notes?.length <= 0 && !loading &&
                        <Text style={{ color: theme.colors.gray, textAlign: "center", margin: 15 }}>
                            {useTranslate("friends.notes.empty")}
                        </Text>
                    }

                    <View style={styles.sectionButtons}>
                        {!user?.friend && <ButtonLight label={useTranslate("commons.add")} onPress={handleAction} />}
                        {user?.friend && <ButtonLight label={useTranslate("commons.remove")} onPress={handleAction} />}
                        <ButtonLight label={useTranslate("commons.close")} onPress={handleClose} />
                    </View>

                </View>
            </View>
        </Modal>
    )
}

export const showFollowModal = (props: followModalProps) => {
     showFollowModalFunction(props) 
}

const styles = StyleSheet.create({
    box: { padding: 15, width: "90%", borderRadius: 10, backgroundColor: theme.colors.section },
    message: { fontSize: 14, color: theme.colors.gray },
    infolog: { paddingHorizontal: 15, paddingVertical: 8, marginVertical: 18, borderRadius: 10,
        backgroundColor: theme.colors.semitransparent, color: theme.colors.gray },
    image: { width: 60, height: 60, borderRadius: 50, overflow: "hidden", borderWidth: 1, 
        borderColor: theme.colors.blue },
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
