import { View, Text, FlatList, ActivityIndicator } from "react-native"
import { SectionContainer } from "@components/general/section"
import { ButtonDanger, ButtonSuccess } from "@components/form/Buttons"
import { listenerEvents } from "@src/services/nostr/events"
import { getPairKey } from "@src/services/memory/pairkeys"
import { NostrEventKinds } from "@src/constants/Events"
import { useAuth } from "@src/providers/userProvider"
import { HeaderFeed } from "../headers"
import { useState } from "react"
import theme from "@src/theme"

type EventData = {
    id: string,
    kind: number,
    pubkey: string,
    content: string,
    created_at: number
}

const FeedScreen = ({ navigation }: any) => {

    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [posts, setPosts] = useState<EventData[]>([])

    const handleData = async () => {
        setLoading(true)

        const { publicKey } = await getPairKey(user?.keychanges ?? "")

        const result = await listenerEvents({ limit: 2, kinds: [NostrEventKinds.classifiedListening] });

        setPosts(result)

        setLoading(false)
    }

    const renderItem = ({ item }: { item: EventData }) =>
    (
        <SectionContainer >
            <Text style={{ fontSize: 16, color: theme.colors.gray, margin: 10, textAlign: "center" }}>{item.content}</Text>
            <View style={{ width: "100%", flexDirection: "row", alignItems: "center" }}>
                <ButtonSuccess label="Buy" onPress={() => { }} />
                <ButtonDanger label="Sell" onPress={() => { }} />
            </View>
        </SectionContainer>
    )

    const ListEndLoader = () => {
        if (loading)
            // Show loader at the end of list when fetching next page data.
            return <ActivityIndicator color={theme.colors.gray} style={{ margin: 10 }} size={50} />
    }

    return (
        <>
            <HeaderFeed navigation={navigation} />
            <FlatList
                data={posts}
                renderItem={renderItem}
                onEndReached={handleData}
                onEndReachedThreshold={2}
                contentContainerStyle={[theme.styles.scroll_container, { backgroundColor: theme.colors.black, alignItems: "center" }]}
                ListFooterComponent={ListEndLoader}
            />
        </>

    )
}

export default FeedScreen