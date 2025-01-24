import { ButtonDefault, ButtonSuccess } from "@components/form/Buttons"
import { Image, StyleSheet, Text, View } from "react-native"
import SplashScreen from "@components/general/SplashScreen"
import { getEvent } from "../services/nostr/events"
import { userService } from "../core/userManager"
import { useEffect, useState } from "react"
import { useAuth } from "../providers/userProvider"
import { emptioService } from "../core/emptio"
import { useTranslateService } from "../providers/translateProvider"
import { walletService } from "../core/walletManager"
import { NostrEvent } from "@nostr-dev-kit/ndk"
import { getNostrInstance, subscribeUserChat } from "../services/nostr/pool"
import { getNotificationPermission } from "../services/permissions"
import { initDatabase } from "../services/memory/database/events"
import theme from "@src/theme"
import { messageService } from "../core/messageManager"
import useChatStore from "../services/zustand/chats"

const InitializeScreen = ({ navigation }: any) => {

    const { setChats, addChat } = useChatStore()
    const { setUser, setEmptioData, setWallets, setFollowsEvent } = useAuth()
    const [loading, setLoading] = useState(true)
    const { useTranslate } = useTranslateService()

    useEffect(() => { handleVerifyLogon() }, [])

    const handleVerifyLogon = async () => {

        await initDatabase()

        await getNotificationPermission()
        
        const wallets = await walletService.list()

        if(wallets && setWallets) setWallets(wallets)

        if (await userService.isLogged({ setUser })) 
        {
            if (setEmptioData)
                setEmptioData(await emptioService.getInitalData())
            
            if(setFollowsEvent) 
            {
                const user = await userService.getUser()
                
                Nostr = await getNostrInstance({ user })

                const eventFollow = await getEvent({ kinds:[3], authors: [user?.pubkey ?? ""], limit: 1 })
                
                if(eventFollow) setFollowsEvent(eventFollow as NostrEvent)

                const chats = await messageService.listChats(user)

                setChats(chats)

                subscribeUserChat({ user, addChat })
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
