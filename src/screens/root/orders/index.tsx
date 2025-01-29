import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native"
import { SectionContainer } from "@components/general/section"
import { ButtonDanger, ButtonSuccess } from "@components/form/Buttons"
import { listenerEvents } from "@services/nostr/events"
import { NostrEventKinds } from "@src/constants/Events"
import { useAuth } from "@src/providers/userProvider"
import { memo, useEffect, useState } from "react"
import { useTranslateService } from "@/src/providers/translateProvider"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { RefreshControl } from "react-native-gesture-handler"
import { pushMessage } from "@services/notification"
import { NostrEvent } from "@services/nostr/events"
import { User } from "@services/memory/types"
import { HeaderFeed } from "./header"
import theme from "@src/theme"
import { StackScreenProps } from "@react-navigation/stack"

const FeedScreen = ({ navigation }: StackScreenProps<any>) => {

    const { follows, wallets } = useAuth()
    const { useTranslate } = useTranslateService()
    const [loading, setLoading] = useState(false)
    const [posts, setPosts] = useState<NostrEvent[]>([])

    useEffect(() => {
        navigation.setOptions({ header: () => <HeaderFeed navigation={navigation} /> })
    }, [])

    const handleData = async () => {
        setLoading(true)
        
        if(follows?.tags?.length) 
        {
            const friends = follows.tags?.filter(tag => tag[0] == "p").map(e => e[1]);

            listenerEvents({ 
                limit: friends?.length, 
                kinds: [NostrEventKinds.metadata],
                authors: friends 
            }).then(setPosts)
        }

        if(!wallets.length)
            pushMessage(useTranslate("message.wallet.alertcreate"))    

        setLoading(false)
    }

    const ListItem = memo(({ item }: { item: NostrEvent }) => {
        const follow = item.content as User
        return (
            <SectionContainer style={{ backgroundColor: theme.colors.blueOpacity }}>
                <Text style={{ fontSize: 16, color: theme.colors.gray, margin: 10, textAlign: "center" }}>
                    {follow.display_name ?? follow?.name}
                </Text>
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
        <View style={{ flex: 1 }}>

            <FlatList
                data={posts}
                renderItem={({ item }) => <ListItem item={item}/>}
                onEndReached={handleData}
                ListEmptyComponent={EmptyComponent}
                onEndReachedThreshold={.1}
                contentContainerStyle={[theme.styles.scroll_container]}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={handleData} />}
                keyExtractor={event => event.id ?? ""}
            />

            <View style={styles.rightButton}>
                <TouchableOpacity activeOpacity={.7} style={styles.newOrderButton} onPress={newOrder}>
                    <Ionicons name="add" size={theme.icons.medium} color={theme.colors.white} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    newOrderButton: { backgroundColor: theme.colors.blue, padding: 18, borderRadius: 50 },
    rightButton: { position: "absolute", bottom: 8, right: 0, width: 90, height: 70, justifyContent: "center", alignItems: "center" }
})

export default FeedScreen
