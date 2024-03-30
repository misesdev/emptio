import { StyleSheet, View, ScrollView, RefreshControl, Text, NativeScrollEvent, NativeSyntheticEvent, FlatList, ActivityIndicator } from "react-native"
import theme from "@src/theme"
import { useEffect, useState } from "react"
import { SectionContainer } from "@/src/components/general/section"
import { ButtonDanger, ButtonSuccess } from "@components/form/Buttons"
import { listenerEvents } from "@src/services/nostr/events"
import { getPairKeys } from "@src/services/memory"

type EventData = {
    id: string,
    kind: number,
    pubkey: string,
    content: string,
    created_at: number
}

const Feed = ({ navigation }: any) => {

    const [loading, setLoading] = useState(false)
    const [posts, setPosts] = useState<EventData[]>([])

    const handleData = async () => {
        setLoading(true)

        console.log("chamou")

        const { publicKey } = await getPairKeys()

        const result = await listenerEvents({ limit: 2, kinds: [30402] });

        console.log(result)

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
        <FlatList
            data={posts}
            renderItem={renderItem}
            onEndReached={handleData}
            onEndReachedThreshold={2}
            contentContainerStyle={[theme.styles.scroll_container, { backgroundColor: theme.colors.black, alignItems: "center" }]}
            ListFooterComponent={ListEndLoader}
        />

    )
}

export default Feed