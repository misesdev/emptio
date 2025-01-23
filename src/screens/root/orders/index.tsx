import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native"
import { SectionContainer } from "@components/general/section"
import { ButtonDanger, ButtonSuccess } from "@components/form/Buttons"
import { listenerEvents } from "@src/services/nostr/events"
import { NostrEventKinds } from "@src/constants/Events"
import { useAuth } from "@src/providers/userProvider"
import { HeaderFeed } from "./header"
import { memo, useEffect, useState } from "react"
import theme from "@src/theme"
import { useTranslateService } from "@/src/providers/translateProvider"
import { Ionicons } from "@expo/vector-icons"
import { User } from "@/src/services/memory/types"
import { RefreshControl } from "react-native-gesture-handler"
import { pushMessage } from "@/src/services/notification"
import { useNotificationBar } from "@/src/providers/notificationsProvider"

const FeedScreen = ({ navigation }: any) => {

    const { followsEvent, wallets } = useAuth()
    const { setNotificationApp } = useNotificationBar()
    const { useTranslate } = useTranslateService()
    const [loading, setLoading] = useState(false)
    const [posts, setPosts] = useState<User[]>([])

    useEffect(() => {
        if(setNotificationApp) setNotificationApp({ type: "orders", state: false })
    }, [])

    const handleData = async () => {
        setLoading(true)
        
        if(followsEvent?.tags?.length) 
        {
            const friends = followsEvent.tags?.filter(tag => tag[0] == "p").map(e => e[1]);

            //const resultPosts = await 
            listenerEvents({ 
                limit: friends?.length, 
                kinds: [NostrEventKinds.metadata],
                authors: friends 
            }).then(resultPosts => {
                const users = resultPosts.map(event => event.content as User);
                setPosts(users)
            })
        }

        if(!wallets.length)
            pushMessage(useTranslate("message.wallet.alertcreate"))    

        setLoading(false)
    }

    const ListItem = memo(({ item }: { item: User }) => {
        return (
            <SectionContainer >
                <Text style={{ fontSize: 16, color: theme.colors.gray, margin: 10, textAlign: "center" }}>{item.display_name}</Text>
                <View style={{ width: "100%", flexDirection: "row", alignItems: "center" }}>
                    <ButtonSuccess label="Buy" onPress={() => { }} />
                    <ButtonDanger label="Sell" onPress={() => { }} />
                </View>
            </SectionContainer>
        )
    })

    const EmptyComponent = () => (
        <Text style={{ width: "80%", color: theme.colors.gray, marginTop: 200, textAlign: "center" }}>
            {useTranslate("feed.empty")}
        </Text>
    )

    const newOrder = () => {
        if(!wallets.length)
            return pushMessage(useTranslate("message.wallet.alertcreate"))

        navigation.navigate("feed-order-new")
    }

    return (
        <>
            <HeaderFeed navigation={navigation} />

            <FlatList
                data={posts}
                renderItem={({ item }) => <ListItem item={item}/>}
                onEndReached={handleData}
                ListEmptyComponent={EmptyComponent}
                onEndReachedThreshold={.1}
                contentContainerStyle={[theme.styles.scroll_container]}
                //ListFooterComponent={listEndLoader}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={handleData} />}
                keyExtractor={event => event.pubkey ?? Math.random().toString()}
            />

            <View style={styles.rightButton}>
                <TouchableOpacity activeOpacity={.7} style={styles.newChatButton} onPress={newOrder}>
                    <Ionicons name="add" size={theme.icons.medium} color={theme.colors.white} />
                </TouchableOpacity>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    newChatButton: { backgroundColor: theme.colors.blue, padding: 18, borderRadius: 50 },
    rightButton: { position: "absolute", bottom: 10, right: 0, width: 100, height: 70, justifyContent: "center", alignItems: "center" }
})

export default FeedScreen
