import { StyleSheet, View, Text } from "react-native"
import theme from "@/src/theme"
import { useTranslateService } from "@/src/providers/translateProvider"

export const HeaderChats = ({ navigation }: any) => {

    const { useTranslate } = useTranslateService()

    return (
        <View style={styles.header}>
            <View style={{ width: "75%", padding: 6 }}>
                <Text style={styles.title}>
                    {useTranslate("chats.title")}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        width: "100%",
        flexDirection: "row",
        paddingVertical: 5,
        backgroundColor: theme.colors.black
    },
    title: { color: theme.colors.white, fontSize: 20, fontWeight: "bold", marginLeft: 15 },
})
