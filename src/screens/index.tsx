import { ButtonDefault, ButtonSuccess } from "@components/form/Buttons"
import { Image, StyleSheet, Text, View } from "react-native"
import SplashScreen from "@components/general/SplashScreen"
import { getEvent, getNostrInstance, listenerEvents } from "../services/nostr/events"
import { userService } from "../core/userManager"
import { useEffect, useState } from "react"
import { useAuth } from "../providers/userProvider"
import { emptioService } from "../core/emptio"
import { useTranslateService } from "../providers/translateProvider"
import { walletService } from "../core/walletManager"
import NDK, { NDKEvent, NostrEvent } from "@nostr-dev-kit/ndk"
import theme from "@src/theme"
import { kinds } from "nostr-tools"

const InitializeScreen = ({ navigation }: any) => {

    const { setUser, setEmptioData, setWallets, setFollowsEvent } = useAuth()
    const [loading, setLoading] = useState(true)
    const { useTranslate } = useTranslateService()

    useEffect(() => { handleVerifyLogon() }, [])

    const handleVerifyLogon = async () => {

        Nostr = (await getNostrInstance()) as NDK

        const wallets = await walletService.list()

        if(wallets && setWallets) setWallets(wallets)

        if (await userService.isLogged({ setUser })) 
        {
            if (setEmptioData)
                setEmptioData(await emptioService.getInitalData())
            
            if(setFollowsEvent) 
            {
                const user = await userService.getUser()
                const eventFollow = await getEvent({ kinds:[3], authors: [user?.pubkey ?? ""], limit: 1 })
                if(eventFollow) {
                    setFollowsEvent(eventFollow as NostrEvent)
                    
                    const follows = eventFollow.tags?.filter(t => t[0] == "p").map(t => t[1])
                    const subscription = Nostr.subscribe({ kinds: [1], authors: [follows] })

                    subscription.on("event", (event: NDKEvent) => {
                        console.log(event)
                    })
                }
            }                

            navigation.reset({ index: 0, routes: [{ name: "authenticate-stack" }] })
        }
        else
            setLoading(false)
    }

    if (loading)
        return <SplashScreen message="connecting to relays..." />

    return (
        <View style={theme.styles.container}>
            <Image style={styles.logo} source={require("@assets/emptio.png")} />

            <Text style={styles.title}>{useTranslate("initial.message")}</Text>

            <View style={styles.buttonArea}>
                <ButtonSuccess label={useTranslate("commons.signin")} onPress={() => navigation.navigate("login-stack")} />
                <ButtonDefault label={useTranslate("commons.signup")} onPress={() => navigation.navigate("register-stack")} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    logo: { maxWidth: "70%", height: "26%", marginTop: -100 },
    title: { marginVertical: 10, color: theme.colors.gray },
    buttonArea: { width: '100%', position: 'absolute', justifyContent: 'center', marginBottom: 40, flexDirection: "row", bottom: 10 }
})

export default InitializeScreen;
