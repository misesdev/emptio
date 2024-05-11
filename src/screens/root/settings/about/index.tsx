
import { StyleSheet, View, Text, ScrollView, Image } from "react-native"
import theme from "@src/theme"
import { HeaderScreen } from "@/src/components/general/HeaderScreen"
import { useTranslate } from "@/src/services/translate"

const AboutScreen = ({ navigation }: any) => {

    return (
        <>
            <HeaderScreen title={useTranslate("settings.about")} onClose={() => navigation.navigate("user-menu-stack")}/>
            <ScrollView contentContainerStyle={theme.styles.scroll_container} >
           
                <Image source={require("assets/emptio.png")} style={styles.logo}/>

                <Text style={{ color: theme.colors.gray, marginVertical: 20, marginHorizontal: 10 }}>
                    {useTranslate("settings.about.content")}
                </Text>

            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.colors.gray
    },
    logo: {
        maxWidth: "80%",
        height: "25%",
    }
})

export default AboutScreen