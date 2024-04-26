import SplashScreen from "@components/general/SplashScreen"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { useEffect, useState } from "react"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { useTranslate } from "@src/services/translate"
import { walletService } from "@src/core/walletManager"
import AlertBox, { alertMessage } from "@components/general/AlertBox"
import { ButtonPrimary } from "@components/form/Buttons"
import theme from "@src/theme"

const CreatedSeedScren = ({ navigation, route }: any) => {

    const [loading, setLoading] = useState(true)
    const [wordList, setWordList] = useState<string[]>()

    useEffect(() => { loadData() }, [])

    const loadData = async () => {

        const seed = await walletService.seed(route.params?.pairkey)

        if (seed.success)
            setWordList(seed.data?.split(" "))
        else
            alertMessage(seed.message)

        setLoading(false)
    }

    const handleClose = () => {
        if (route?.params?.origin == "options")
            navigation.navigate("wallet-settings-stack")
        else if (route?.params?.origin == "create")
            navigation.reset({ index: 0, routes: [{ name: "core-stack" }] })
    }

    if (loading)
        return <SplashScreen />

    return (
        <>
            {/* Header */}
            <HeaderScreen title={useTranslate("wallet.title.seed")} onClose={handleClose} />

            <Text style={styles.title}>{useTranslate("message.wallet.saveseed")}</Text>

            {/* Body */}
            <ScrollView showsVerticalScrollIndicator>
                <View style={styles.seedarea}>
                    <View style={{ width: "50%", padding: 8 }}>
                        {wordList && wordList.slice(0, 12).map((word, index) => <Text key={word} style={styles.word}>{`#${index + 1} - ${word}`}</Text>)}
                    </View>
                    <View style={{ width: "50%", padding: 8 }}>
                        {wordList && wordList.slice(12, 24).map((word, index) => <Text key={word} style={styles.word}>{`#${index + 13} - ${word}`}</Text>)}
                    </View>
                </View>
            </ScrollView>
            <View style={styles.buttonarea}>
                <ButtonPrimary label={useTranslate("commons.ok")} onPress={handleClose} />
            </View>
            <AlertBox />
        </>
    )
}

const styles = StyleSheet.create({
    title: { fontSize: 30, maxWidth: "90%", fontWeight: "bold", textAlign: "center", color: theme.colors.white, marginVertical: 20 },
    seedarea: { width: "100%", marginVertical: 20, flexDirection: "row" },
    buttonarea: { width: "100%", paddingVertical: 20, justifyContent: "center", alignItems: "center" },
    word: { color: theme.colors.white, fontSize: 14, fontWeight: "bold", marginVertical: 4, padding: 15, borderRadius: 10, backgroundColor: "rgba(255,255,255, .2)" }
})

export default CreatedSeedScren
