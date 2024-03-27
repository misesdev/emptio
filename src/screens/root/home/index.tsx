import { StyleSheet, Text, View, ScrollView, RefreshControl } from "react-native"
import theme from "@src/theme"
import { useEffect, useState } from "react"
import SplashScreen from "@components/general/SplashScreen"
import { SectionContainer } from "@/src/components/general/section"
import { ButtonDanger, ButtonPrimary } from "@components/form/Buttons"
import { getPairKeys, getWallets } from "@src/services/memory"
import { listenerEvents } from "@src/services/nostr/events"
import { UpdateUserProfile } from "@src/services/userManager"
import { ActionHeader, SectionHeader } from "@/src/components/general/section/headers"
import { Wallet } from "@/src/services/memory/types"

type EventData = {
    kind: number,
    pubkey: string,
    content: string
}

const Home = ({ navigation }: any) => {

    const [loading, setLoading] = useState(true)
    const [events, setEvents] = useState<EventData[]>([])
    const [wallets, setWallets] = useState<Wallet[]>()

    useEffect(() => {
        handleData()
    }, [])

    const handleData = async () => {
        setLoading(true)

        await UpdateUserProfile()

        console.log("profile updated")
        const wallets = await getWallets()

        setWallets(wallets)

        setLoading(false)
    }

    const actionWallet : ActionHeader = { icon: "add-circle", action: () => { 
            console.log("action -> wallets") 
        } 
    }
    
    if (loading)
        return <SplashScreen />

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={theme.styles.scroll_container}
                refreshControl={<RefreshControl refreshing={false} onRefresh={handleData} />}
            >
                <View style={{ width: "100%", height: 30 }}></View>
                {/* Wallets */}
                <SectionHeader label="Wallets" actions={[actionWallet]} />

                <SectionContainer>
                    {/* Wallets section  */}
                    {wallets && <></>}
                    {!wallets && <></>}
                </SectionContainer>


                {/* Sales and Shopping */}
                {events && events.map((event, key) => {
                    return <SectionContainer key={key}>
                        <Text style={{ fontSize: 16, color: theme.colors.gray, margin: 10 }}>{event.content}</Text>
                        <View style={{ flexDirection: "row" }}>
                            <ButtonPrimary label="Repost" onPress={() => { }} />
                            <ButtonDanger label="Donate" onPress={() => { }} />
                        </View>
                    </SectionContainer>
                })}

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        padding: 10,
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.colors.gray,
    },
    container: {
        backgroundColor: theme.colors.black,
        height: "100%"
    },
})

export default Home