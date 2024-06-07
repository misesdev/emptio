import { View, Text, FlatList, ActivityIndicator } from "react-native"
import { SectionContainer } from "@components/general/section"
import { ButtonDanger, ButtonSuccess } from "@components/form/Buttons"
import { listenerEvents } from "@src/services/nostr/events"
import { NostrEventKinds } from "@src/constants/Events"
import { useAuth } from "@src/providers/userProvider"
import { HeaderFeed } from "./header"
import { useState } from "react"
import theme from "@src/theme"
import { NostrEvent } from "@nostr-dev-kit/ndk"
import { useTranslateService } from "@/src/providers/translateProvider"

const FeedScreen = ({ navigation }: any) => {

    const { user } = useAuth()
    const { useTranslate } = useTranslateService()
    const [loading, setLoading] = useState(false)
    const [posts, setPosts] = useState<NostrEvent[]>([])

    const handleData = async () => {
        setLoading(true)

        console.log("loading data")

        let lastPost: NostrEvent | undefined

        if (posts.length)
            lastPost = posts.findLast(event => event)

        const result = await listenerEvents({ limit: 5, kinds: [NostrEventKinds.classifiedListening], since: lastPost?.created_at });

        const resultPosts = result.filter(event => posts.filter(post => post.id == event.id).length <= 0)

        setPosts([...posts, ...resultPosts])

        setLoading(false)
    }

    const renderItem = ({ item }: { item: NostrEvent }) =>
    (
        <SectionContainer >
            <Text style={{ fontSize: 16, color: theme.colors.gray, margin: 10, textAlign: "center" }}>{item.content}</Text>
            <View style={{ width: "100%", flexDirection: "row", alignItems: "center" }}>
                <ButtonSuccess label="Buy" onPress={() => { }} />
                <ButtonDanger label="Sell" onPress={() => { }} />
            </View>
        </SectionContainer>
    )

    const listEndLoader = () => {
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
                ListFooterComponent={listEndLoader}
                keyExtractor={event => event.id ?? Math.random().toString()}
            />
        </>

    )
}

export default FeedScreen