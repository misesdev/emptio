import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native"
import { SectionContainer } from "@components/general/section"
import { ButtonDanger, ButtonSuccess } from "@components/form/Buttons"
import { listenerEvents } from "@src/services/nostr/events"
import { NostrEventKinds } from "@src/constants/Events"
import { useAuth } from "@src/providers/userProvider"
import { HeaderFeed } from "./header"
import { memo, useState } from "react"
import theme from "@src/theme"
import { useTranslateService } from "@/src/providers/translateProvider"
import { Ionicons } from "@expo/vector-icons"
import { User } from "@/src/services/memory/types"
import { RefreshControl } from "react-native-gesture-handler"
import { pushMessage } from "@/src/services/notification"

const FeedScreen = ({ navigation }: any) => {

    const { user, followsEvent, wallets } = useAuth()
    const { useTranslate } = useTranslateService()
    const [loading, setLoading] = useState(false)
    const [posts, setPosts] = useState<User[]>([])
    const [notResult, setNotResult] = useState(false);

    const handleData = async () => {
        setLoading(true)
        
        if(!followsEvent?.tags.length) setNotResult(true)

        if(followsEvent?.tags.length) 
        {
            const friends = followsEvent.tags?.filter(tag => tag[0] == "p").map(e => e[1]);

            const resultPosts = await listenerEvents({ 
                limit: friends?.length, 
                kinds: [NostrEventKinds.metadata],
                authors: friends 
            });

            const users = resultPosts.map(event => event.content as User);

            setPosts(users)
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
                style={{ flex: 1 }}
                renderItem={({ item }) => <ListItem item={item}/>}
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
