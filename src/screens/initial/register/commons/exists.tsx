import { Modal, StyleSheet, View, Text, TouchableOpacity } from "react-native"
import { UserList } from "@components/nostr/user/UserList"
import { ButtonPrimary } from "@components/form/Buttons"
import { User } from "@services/user/types/User"
import { useState } from "react"
import theme from "@src/theme"

var showOptionsFunction: (users: User[]) => void

interface VideoOptionProps {
    onRegister: () => Promise<void>
}

const ExistentUsersBar = ({ onRegister }: VideoOptionProps) => {

    const [visible, setVisible] = useState(false)
    const [users, setUsers] = useState<User[]>([])

    showOptionsFunction = (users: User[]) => {
        setUsers(users)
        setVisible(true)
    }

    return (
        <Modal visible={visible} transparent animationType="slide"
            onRequestClose={() => setVisible(false)}>
            <View style={styles.overlayer}>
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            There are similar users
                        </Text>
                        <TouchableOpacity onPress={() => setVisible(false)}>
                            <Text style={styles.closeButton}>✕</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={theme.styles.row}>
                        <UserList users={users} onPressUser={() => {}} />
                    </View>
                    <ButtonPrimary 
                        label="continuar" 
                        onPress={onRegister}
                        style={{ position: "absolute", bottom: 10, right: 10 }}
                        rightIcon="arrow-forward"
                    />
                </View>
            </View>
        </Modal>
    )
}

export const showExistentUsers = (users: User[]) => {
    setTimeout(() => showOptionsFunction(users), 20)
}

const styles = StyleSheet.create({
    overlayer: { flex: 1, justifyContent: "flex-end", backgroundColor: theme.colors.transparent,
        padding: 6 },
    modalContainer: { height: "70%", backgroundColor: theme.colors.semitransparentdark,
        borderRadius: 10, padding: 12 },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center",
        marginBottom: 10, paddingHorizontal: 10  },
    title: { fontSize: 18, fontWeight: "bold", color: theme.colors.white },
    closeButton: { fontSize: 22, color: theme.colors.gray },
})

export default ExistentUsersBar

