import { StyleSheet, View, ScrollView, RefreshControl, Text } from "react-native"
import theme from "@src/theme"
import { useEffect, useState } from "react"
import SplashScreen from "@components/general/SplashScreen"
import { Section } from "@components/general/Section"
import { ButtonDanger, ButtonSuccess } from "@components/form/Buttons"
import { listenerEvents, publishEvent } from "@src/services/nostr/events"
import { getPairKeys } from "@src/services/memory"

type EventData = {
    kind: number,
    pubkey: string,
    content: string
}

const Feed = ({ navigation }: any) => {

    const [loading, setLoading] = useState(true)
    const [posts, setPosts] = useState<EventData[]>()
    
    useEffect(() => handleData(), [])

    const handleData = () => {
        setLoading(true)
        const { publicKey } = getPairKeys()
        listenerEvents({ limit: 5, kinds: [0], authors: [publicKey] }).then(result => {
            setPosts(result)

            setLoading(false)
        })
    }

    const handleEvent = async () => {
        setLoading(true)

        await publishEvent({ kind: 1, content: "Testando eventos gerados em backgroundo" }, getPairKeys())
        
        setLoading(false)
    }

    if (loading)
        return <SplashScreen />

    return (
        <View style={styles.container} >
            <ScrollView
                contentContainerStyle={styles.scroll_container}
                refreshControl={<RefreshControl refreshing={false} onRefresh={handleData} />}
            >
                <View style={{ width: "100%", height: 30 }}></View>
                {posts && posts.map((event, key) => {
                    return <Section key={key}>
                        <Text style={{ fontSize: 16, color: theme.colors.gray, margin: 10 }}>{event.content}</Text>
                        <View style={{ flexDirection: "row" }}>
                            <ButtonSuccess label="Buy" onPress={() => { }} />
                            <ButtonDanger label="Sell" onPress={handleEvent} />
                        </View>
                    </Section>
                })}

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.colors.gray
    },
    container: {
        backgroundColor: theme.colors.black,
        height: "100%"
    },
    scroll_container: {
        flexGrow: 1,
        alignItems: "center"
    }
})

export default Feed