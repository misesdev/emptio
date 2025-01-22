import { TextBox } from "@/src/components/form/TextBoxs"
import { useTranslateService } from "@/src/providers/translateProvider"
import { hexToNpub } from "@/src/services/converter"
import { User } from "@/src/services/memory/types"
import theme from "@/src/theme"
import { useState } from "react"
import { View, StyleSheet, Image, Text, TextInput, 
    KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"

const ConversationChat = ({ navigation, route }: any) => {
    
    const user = route.params.user as User
    const { useTranslate } = useTranslateService()
    const [message, setMessage] = useState<string>("")
    var userName = user.display_name ?? user.name ?? ""

    userName = userName.length > 20 ? `${userName?.substring(0,30)}..` : userName

    return (
        <KeyboardAvoidingView 
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding": "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
            <View style={styles.headerContainer}>
                <View style={{ width: "15%", padding: 5 }}>
                    <View style={styles.imageContainer}>
                        {user?.picture && <Image onError={() => { user.picture = "" }} source={{ uri: user?.picture }} style={{ flex: 1 }} />}
                        {!user?.picture && <Image source={require("assets/images/defaultProfile.png")} style={{ width: 50, height: 50 }} />}                               
                    </View>
                </View>
                <View style={{ width: "70%", padding: 5 }}>
                    <View style={{ }}>
                        <Text style={styles.userName}>
                            {user.display_name ?? user.name}
                        </Text>
                        <Text style={styles.pubkey}>{hexToNpub(user.pubkey ?? "").substring(0, 28)}..</Text>
                    </View>
                </View>
            </View>


            <View style={styles.chatBoxContainer}>
                <View style={{ flexDirection: "row" }}>
                    <View style={styles.chatInputContainer}>
                        <TextInput style={styles.chatInput} 
                            value={message} 
                            multiline
                            numberOfLines={5}
                            textContentType="none"
                            placeholder="Mensagem"//{useTranslate("labels.message")}
                            placeholderTextColor={theme.input.placeholderColor}
                            underlineColorAndroid={theme.colors.transparent}
                            onChangeText={setMessage} 
                        />
                    </View> 
                    <View style={{ width: "18%", alignItems: "center", justifyContent: "center" }}>
                        <TouchableOpacity style={styles.sendButton} onPress={() => {}} >
                            <Ionicons name="paper-plane" 
                                size={24} color={theme.colors.white}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ height: 45 }} ></View>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    headerContainer: { position: "absolute", top: 0, flexDirection: "row", width: "100%", 
        padding: 2, backgroundColor: theme.colors.black },
    imageContainer: { width: 50, height: 50, borderRadius: 50, overflow: "hidden" },
    userName: { fontSize: 18, fontWeight: "500", color: theme.colors.white },
    pubkey: { fontSize: 14, fontWeight: "400", color: theme.colors.gray },

    chatBoxContainer: { position: "absolute", bottom: 0, padding: 10,  
        width: "100%", backgroundColor: theme.colors.black },
    chatInputContainer: { width: "82%", borderRadius: 20, paddingHorizontal: 18, 
        backgroundColor: theme.input.backGround },
    chatInput: { color: theme.input.textColor, paddingVertical: 16, paddingHorizontal: 6 },
    sendButton: { borderRadius: 50, padding: 12, backgroundColor: theme.colors.green, 
        transform: [{ rotate: "45deg" }]
    }
})

export default ConversationChat
