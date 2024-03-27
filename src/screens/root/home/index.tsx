import { StyleSheet, Text, View, ScrollView, RefreshControl } from "react-native"
import theme from "@src/theme"
import { useEffect, useState } from "react"
import SplashScreen from "@components/general/SplashScreen"
import { Section } from "@components/general/Section"
import { ButtonDanger, ButtonPrimary } from "@components/form/Buttons"
import { getPairKeys } from "@src/services/memory"
import { getEvent, listenerEvents } from "@src/services/nostr/events"
import { UpdateUser } from "@/src/services/userManager"

type EventData = {
    kind: number,
    pubkey: string,
    content: string
}

const Home = ({ navigation }: any) => {

    const [loading, setLoading] = useState(true)
    const [events, setEvents] = useState<EventData[]>([])

    useEffect(() => { handleData() }, [])

    const handleData = async () => {
        setLoading(true)
        const { publicKey } = getPairKeys()

        UpdateUser()
        
        listenerEvents({ limit: 6, kinds: [1, 4], authors: [publicKey] }).then(result => {
            
            setEvents(result)

            setLoading(false)
        }) 
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
                {events && events.map((event, key) => {
                    return <Section key={key}>
                        <Text style={{ fontSize: 16, color: theme.colors.gray, margin: 10 }}>{event.content}</Text>
                        <View style={{ flexDirection: "row" }}>
                            <ButtonPrimary label="Repost" onPress={() => { }} />
                            <ButtonDanger label="Donate" onPress={() => { }} />
                        </View>
                    </Section>
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