
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, Linking } from "react-native"
import theme from "@src/theme"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { useTranslate } from "@/src/services/translate"
import { Ionicons } from "@expo/vector-icons"

const AboutScreen = ({ navigation }: any) => {

    const handleToGithub = () => Linking.openURL("https://github.com/emptioapp/emptio")

    const hndleToDiscord = () => Linking.openURL("https://discord.gg/pUxPZHPu")

    return (
        <>
            <HeaderScreen title={useTranslate("settings.about")} onClose={() => navigation.navigate("user-menu-stack")} />
            <ScrollView contentContainerStyle={theme.styles.scroll_container} >

                <Image source={require("assets/emptio.png")} style={styles.logo} />

                <View style={{ padding: 15, marginVertical: 20 }}>
                    <Text style={{ color: theme.colors.gray, fontSize: 18 }}>
                        {useTranslate("settings.about.content")}
                    </Text>
                </View>

                <View style={{ flexDirection: "row", marginVertical: 10 }}>
                    <TouchableOpacity activeOpacity={.7} onPress={handleToGithub} style={styles.itemContact}>
                        <Ionicons name="logo-github" size={theme.icons.extra} color={theme.colors.white} />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={.7} onPress={hndleToDiscord} style={styles.itemContact}>
                        <Ionicons name="logo-discord" size={theme.icons.extra} color={theme.colors.white} />
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: "row", marginVertical: 10 }}>
                    <Text style={{ textAlign: "center", color: theme.colors.gray, fontWeight: "bold", fontSize: 13 }}>version 0.0.1</Text>
                </View>

            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    logo: {
        width: "60%",
        height: 180,
    },
    itemContact: {
        borderRadius: 10, 
        borderWidth: 1,
        borderColor: theme.colors.gray,
        width: 100,
        height: 100,
        justifyContent: "center",
        alignItems: "center",
        margin: 10
    }
})

export default AboutScreen