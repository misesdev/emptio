import { StyleSheet, View, ScrollView, RefreshControl, Text } from "react-native"
import theme from "@src/theme"
import { useEffect, useState } from "react"
import SplashScreen from "@components/general/SplashScreen"
import { Section } from "@components/general/Section"
import { ButtonSuccess } from "@components/form/Buttons"
import { getNostrEvents } from "@/src/services/nostr/events"
import { getUser } from "@/src/services/memory"

const Feed = ({ navigation }: any) => {

    const [pubkey, setPubkey] = useState("")
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    useEffect(() => {
        setTimeout(() => setLoading(false), 1000)

        const { publicKey } = getUser()

        setPubkey(publicKey ? publicKey : "")
    }, [])

    const handleRefresh =() => {
        setRefreshing(true)

        getNostrEvents({ limit: 20, kinds: [1], authors: [pubkey] }, pubkey).then(events => {
            console.log(events)
        })

        setTimeout(() => setRefreshing(false), 1000)
    }

    if (loading)
        return <SplashScreen />

    return (
        <View style={styles.container} >
            <ScrollView 
                contentContainerStyle={styles.scroll_container} 
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
            >
                <Section><></></Section>

                <Section><></></Section>

                <ButtonSuccess label="Receive" onPress={() => {}}/>

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