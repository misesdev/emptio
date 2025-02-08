import { ButtonDefault, ButtonSuccess } from "@components/form/Buttons"
import { Image, StyleSheet, Text, View } from "react-native"
import SplashScreen from "@components/general/SplashScreen"
import { getEvent } from "@services/nostr/events"
import { userService } from "@src/core/userManager"
import { useEffect, useState } from "react"
import { useAuth } from "../providers/userProvider"
import { useTranslateService } from "../providers/translateProvider"
import { walletService } from "../core/walletManager"
import { getNostrInstance, subscribeUserChat } from "@services/nostr/pool"
import { getNotificationPermission } from "@services/permissions"
import { initDatabase } from "@services/memory/database/events"
import { messageService } from "../core/messageManager"
import useChatStore from "@services/zustand/chats"
import useNDKStore from "@services/zustand/ndk"
import { NostrEventKinds } from "../constants/Events"
import theme from "@src/theme"
import { useFeedVideosStore } from "../services/zustand/feedVideos"

const InitializeScreen = ({ navigation }: any) => {

    const { setNDK, setNdkSigner } = useNDKStore()
    const { setChats, addChat } = useChatStore()
    const { setUser, setWallets, setFollowsEvent } = useAuth()
    const [loading, setLoading] = useState(true)
    const { useTranslate } = useTranslateService()

    useEffect(() => { 
        handleVerifyLogon()
        useFeedVideosStore.getState().initialize()
    }, [])

    const handleVerifyLogon = async () => {

        await initDatabase()
        
        setNDK(await getNostrInstance({ }))
        
        await getNotificationPermission() 
        
        const wallets = await walletService.list()

        if(wallets && setWallets) setWallets(wallets)

        const result = await userService.isLogged({ setUser })
        if (result.success && result.data) 
        {
            setNdkSigner(result.data)

            setChats(await messageService.listChats(result.data))

            subscribeUserChat({ user: result.data, addChat })
            
            if(setFollowsEvent) 
            {
                const eventFollow = await getEvent({ 
                    kinds:[NostrEventKinds.followList], 
                    authors: [result.data?.pubkey ?? ""], 
                    limit: 1
                })

                if(eventFollow) setFollowsEvent(eventFollow)
            }                
            
            navigation.reset({ index: 0, routes: [{ name: "authenticate-stack" }] })
        }
        setLoading(false)
    }

    if (loading)
        return <SplashScreen message="" />

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
    buttonArea: { width: '100%', position: 'absolute', justifyContent: 'center', 
        marginBottom: 40, flexDirection: "row", bottom: 10 }
})

export default InitializeScreen;
