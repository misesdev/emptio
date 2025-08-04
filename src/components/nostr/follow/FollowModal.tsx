import { useCallback, useState } from "react"
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { NoteList } from "../user/NoteList"
import { ActivityIndicator } from "react-native-paper"
import Ionicons from "react-native-vector-icons/Ionicons"
import { NDKEvent } from "@nostr-dev-kit/ndk-mobile"
import { ProfilePicture } from "../user/ProfilePicture"
import { User } from "@services/user/types/User"
import { useTranslateService } from "@/src/providers/TranslateProvider"
import { useService } from "@/src/providers/ServiceProvider"
import { Utilities } from "@/src/utils/Utilities"
import theme from "@src/theme"

interface followModalProps {
    user: User
}

interface ButtonProps {
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

interface FollowProps {
    handleAddFollow: (user: User) => Promise<void>
}

const FollowModal = ({ handleAddFollow }: FollowProps) => {

    const { userService } = useService()
    const { useTranslate } = useTranslateService()
    const [user, setUser] = useState<User>({} as User)
    const [visible, setVisible] = useState(false)
    const [loading, setloading] = useState(false)
    const [notes, setNotes] = useState<NDKEvent[]>([])

    const handleLoadData = useCallback(async (user: User) => {
        setloading(true)
        const latestNotes = await userService.lastNotes(10)
        setNotes(latestNotes)
        setloading(false)
    }, [setNotes, setloading, userService])

    showFollowModalFunction = useCallback(async ({ user }: followModalProps) => {
        setUser(user)
        setVisible(true)
        setTimeout(() => handleLoadData(user), 100)
    }, [setUser, setVisible, handleLoadData])

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
        <Modal animationType="slide" onRequestClose={handleClose} visible={visible} >
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: theme.colors.black }}>
                <View style={styles.box}>

                    <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity activeOpacity={.3} onPress={() => {}}>
                            <ProfilePicture user={user} size={60} />
                        </TouchableOpacity>
                        <View style={{ paddingHorizontal: 12 }}>
                            <Text style={{ color: theme.colors.white, fontSize: 20, fontWeight: 'bold' }}>
                                {Utilities.getUserName(user ?? {})}
                            </Text>
                            <TouchableOpacity activeOpacity={.7}
                                onPress={() => Utilities.copyPubkey(user?.pubkey ?? "")}
                                style={{ flexDirection: "row" }}
                            >
                                <Text style={{ fontSize: 14, fontWeight: "500", color: theme.colors.gray }}>
                                    {Utilities.getDisplayPubkey(user?.pubkey ?? "", 20)}
                                </Text>
                                <Ionicons name="copy" size={10} style={{ padding: 5 }} color={theme.colors.gray} />
                            </TouchableOpacity>
                        </View>
                    </View>
                                          
                    {user?.friend && 
                        <Text style={styles.infolog}>
                            <Text style={{ color: theme.colors.blue, fontWeight: "500" }}>
                                {Utilities.getUserName(user)}  
                            </Text> {' '}
                            {useTranslate("message.friend.already")}
                        </Text>
                    }

                    <Text style={{ margin: 10, fontWeight: "500", color: theme.colors.white }}>
                        {useTranslate("friends.notes.lasts")}
                    </Text>
                    
                    <NoteList user={user} notes={notes} isVisible={visible}/>
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
    image: { width: 60, height: 60, borderRadius: 50, overflow: "hidden", borderWidth: 2, 
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
