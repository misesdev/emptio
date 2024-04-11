import theme from "@src/theme"
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Ionicons } from "@expo/vector-icons"
import { useEffect, useState } from "react"
import { HeaderChats } from "./header"

const ChatsScreen = ({ navigation }: any) => {
    
    const [loading, setLoading] = useState(true)
    const [chats, setChats] = useState()

    useEffect(() => {
        handleLoadChats()
    }, [])

    const handleLoadChats = () => {

        setLoading(false)
    }

    return (

        <View style={theme.styles.container}>

            <HeaderChats navigation={navigation} />

            <ScrollView contentContainerStyle={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                {loading && <ActivityIndicator color={theme.colors.gray} size={50} />}

            </ScrollView>
            <View style={styles.rightButton}>
                <TouchableOpacity activeOpacity={.7} style={styles.newChatButton} onPress={() => navigation.navigate("new-chat-stack")}>
                    <Ionicons name="add" size={theme.icons.extra} color={theme.colors.white} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    newChatButton: { backgroundColor: theme.colors.blue, padding: 10, borderRadius: 50 },
    rightButton: { position: "absolute", bottom: 0, right: 0, width: 100, height: 70, justifyContent: "center", alignItems: "center" }
})

export default ChatsScreen