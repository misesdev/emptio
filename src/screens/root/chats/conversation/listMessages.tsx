import { TouchableOpacity, View, Text, StyleSheet, FlatList } from "react-native"
import NoteViewer from "@components/nostr/event/NoteViewer"
import { messageService } from "@src/core/messageManager"
import { User } from "@services/memory/types"
import { NDKEvent } from "@nostr-dev-kit/ndk"
import { memo, useCallback, useEffect, useState } from "react"
import theme from "@/src/theme"

type Props = {
    user: User,
    events: NDKEvent[],
    onMessageOptions: (event: NDKEvent, isUser: boolean) => void
}

const ConversationList = ({ user, events, onMessageOptions }: Props) => {
        
    const ListItem = memo(({ item }: { item: NDKEvent }) => {
        const isUser = (item.pubkey == user.pubkey)
        const [event, setEvent] = useState<NDKEvent>(item)

        useEffect(() => {
            messageService.decryptMessage(user, item).then(setEvent)
        }, [])

        return (
            <TouchableOpacity activeOpacity={1}
                onPress={() => onMessageOptions(item, isUser)}
                style={[styles.messageContainer, { flexDirection: isUser ? "row-reverse" : "row" }]}
            >
                <View style={[styles.contentMessage, 
                        isUser ? styles.messageSended : styles.messageReceived
                    ]}
                >
                    <NoteViewer showUser={false} note={event} />
                    <View style={[styles.messageDetailBox, { flexDirection: isUser ? "row-reverse" : "row" }]}>
                        <Text style={{ fontSize: 11, fontWeight: "500", color: theme.colors.gray }}>
                            {new Date((event.created_at ?? 1) * 1000).toDateString()}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    })

    const renderItem = useCallback(({ item }:{ item: NDKEvent }) => {
        return <ListItem item={item} />
    }, [])

    return (
        <FlatList inverted
            data={events}
            style={styles.scrollContainer}
            showsVerticalScrollIndicator
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            renderToHardwareTextureAndroid
        />
    )
}

const styles = StyleSheet.create({
    scrollContainer: { width: "100%", padding: 10, backgroundColor: theme.colors.black },
    messageContainer: { width: "100%", padding: 10 },
    contentMessage: { width: "90%", padding: 10, borderBottomLeftRadius: 12, borderTopRightRadius: 12 },
    messageReceived: { backgroundColor: theme.colors.section, borderBottomRightRadius: 12 },
    messageSended: { backgroundColor: theme.colors.blueOpacity, borderTopLeftRadius: 12 },
    messageDetailBox: { width: "100%", flexDirection: "row-reverse", marginTop: 12 },
})

export default ConversationList


