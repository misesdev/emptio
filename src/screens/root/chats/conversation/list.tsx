import NoteViewer from "@components/nostr/event/NoteViewer"
import { messageService } from "@src/core/messageManager"
import { User } from "@services/memory/types"
import { NDKEvent } from "@nostr-dev-kit/ndk"
import { useCallback, useEffect, useState } from "react"
import { TouchableOpacity, View, Text, StyleSheet, FlatList } from "react-native"
import theme from "@/src/theme"

type Props = {
    user: User,
    events: NDKEvent[],
    onMessageOptions: (event: NDKEvent, isUser: boolean) => void
}

const ConversationList = ({ user, events, onMessageOptions }: Props) => {
        
    const ListItem = ({ item }: { item: NDKEvent }) => {
        const isUser = (item.pubkey == user.pubkey)
        const [event, setEvent] = useState<NDKEvent>(item)

        useEffect(() => {
            messageService.decryptMessage(user, item).then(setEvent)
        }, [])

        return (
            <TouchableOpacity activeOpacity={1}
                onLongPress={() => onMessageOptions(item, isUser)}
                style={[styles.messageContainer, { flexDirection: isUser ? "row-reverse" : "row" }]}
            >
                <View style={[styles.contentMessage, 
                        isUser ? styles.messageSended : styles.messageReceived
                    ]}
                >
                    <NoteViewer note={event.content} />
                    <View style={[styles.messageDetailBox, { flexDirection: isUser ? "row-reverse" : "row" }]}>
                        <Text style={{ fontSize: 11, fontWeight: "500", color: theme.colors.gray }}>
                            {new Date((event.created_at ?? 1) * 1000).toDateString()}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

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
    contentMessage: { width: "70%", padding: 15, borderBottomLeftRadius: 12, borderBottomRightRadius: 12 },
    messageReceived: { backgroundColor: theme.colors.section, borderTopRightRadius: 12 },
    messageSended: { backgroundColor: theme.colors.blueOpacity, borderTopLeftRadius: 12 },

    messageDetailBox: { width: "100%", flexDirection: "row-reverse", marginTop: 12 },
})

export default ConversationList


