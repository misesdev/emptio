import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native"
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
import { Ionicons } from "@expo/vector-icons"
import { User } from "@/src/services/memory/types"
import { RefreshControl } from "react-native-gesture-handler"

const FeedScreen = ({ navigation }: any) => {

    const { user } = useAuth()
    const { useTranslate } = useTranslateService()
    const [loading, setLoading] = useState(false)
    const [posts, setPosts] = useState<User[]>([])
    const [notResult, setNotResult] = useState(false);

    const handleData = async () => {
        setLoading(true)

        const followList = await listenerEvents({ 
            limit: 1, 
            kinds: [NostrEventKinds.followList],
            authors: [user.pubkey ?? ""] 
        })
        
        if(!followList.length) setNotResult(true)

        if(followList.length) 
        {
            const friends = followList[0].tags.filter(tag => tag[0] == "p").map(e => e[1]);

            const resultPosts = await listenerEvents({ 
                limit: friends.length, 
                kinds: [NostrEventKinds.metadata],
                authors: friends 
            });

            const users = resultPosts.map(event => event.content as User);

            setPosts(users)
        }

        setLoading(false)
    }

    const renderItem = ({ item }: { item: User }) => {
        
        return (
            <SectionContainer >
                <Text style={{ fontSize: 16, color: theme.colors.gray, margin: 10, textAlign: "center" }}>{item.display_name}</Text>
                <View style={{ width: "100%", flexDirection: "row", alignItems: "center" }}>
                    <ButtonSuccess label="Buy" onPress={() => { }} />
                    <ButtonDanger label="Sell" onPress={() => { }} />
                </View>
            </SectionContainer>
        )
    }

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
                style={{ flex: 1 }}
                renderItem={renderItem}
                onEndReached={handleData}
                onEndReachedThreshold={.1}
                contentContainerStyle={[theme.styles.scroll_container, { backgroundColor: theme.colors.black, alignItems: "center" }]}
                //ListFooterComponent={listEndLoader}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={handleData} />}
                keyExtractor={event => event.pubkey ?? Math.random().toString()}
            />
            {
                notResult && 
                <View>
                    <Text style={{ color: theme.colors.white }}>Nenhuma ordem encontrada!</Text>
                </View>
            }
            <View style={styles.rightButton}>
                <TouchableOpacity activeOpacity={.7} style={styles.newChatButton} onPress={() => navigation.navigate("feed-order-new")}>
                    <Ionicons name="add" size={theme.icons.medium} color={theme.colors.white} />
                </TouchableOpacity>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    newChatButton: { backgroundColor: theme.colors.blue, padding: 18, borderRadius: 50 },
    rightButton: { position: "absolute", bottom: 0, right: 0, width: 100, height: 70, justifyContent: "center", alignItems: "center" }
})

export default FeedScreen
