import NoteViewer from "@components/nostr/event/NoteViewer"
import { NDKEvent, NDKFilter, NDKKind, NDKSubscription, NDKSubscriptionCacheUsage, NostrEvent } from "@nostr-dev-kit/ndk-mobile"
import { TouchableOpacity, View, Text, StyleSheet } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import theme from "@src/theme"
import { useTranslateService } from "@src/providers/translateProvider"
import useNDKStore from "@services/zustand/ndk"
import { useEffect, useRef, useState } from "react"
import { useAuth } from "@src/providers/userProvider"
import { noteService } from "@services/nostr/noteService"

interface CommentItemProps {
    event: NostrEvent,
    replies: NostrEvent[]
}

const CommentItem = ({ event, replies }: CommentItemProps) => {
   
    const { user } = useAuth()
    const { ndk } = useNDKStore()
    const timeout = useRef<any>(null)
    const subscription = useRef<NDKSubscription>()
    const { useTranslate } = useTranslateService()
    const [showReplies, setShowReplies] = useState(false)
    const [reacted, setReacted] = useState<boolean>(false)
    const [reactions, setReactions] = useState<NostrEvent[]>([])

    useEffect(() => { 
        setTimeout(fetchReactions, 20)
        const unsubscribe = () => {
            if(timeout.current) clearTimeout(timeout.current)
            if(subscription.current) {
                subscription.current.stop()
                subscription.current.removeAllListeners()
                subscription.current = undefined
            }
        }
        return unsubscribe
    }, [])
        
    const fetchReactions = async () => {
        
        const filter: NDKFilter = { kinds: [NDKKind.Reaction], "#e": [event.id??""] }
        subscription.current = ndk.subscribe(filter, {
            cacheUsage: NDKSubscriptionCacheUsage.ONLY_RELAY
        })  

        subscription.current.on("event", note => setReactions(prev => [...prev, {
            id: note.id,
            kind: note.kind,
            pubkey: note.pubkey,
            tags: note.tags,
            content: note.content,
            created_at: note.created_at,
            sig: note.sig
        } as NostrEvent]))

        timeout.current = setTimeout(() => {
            subscription.current?.stop()
            subscription.current?.removeAllListeners()
            subscription.current = undefined
            setReacted(reactions.some(r => r.pubkey == user.pubkey))
        }, 1000)
    }

    const handleReact = () => {
        setReacted(prev => !prev)
        setTimeout(() => {
            const reaction = reactions.find(r => r.pubkey == user.pubkey) as NostrEvent
            if(!reaction) {
                setReactions(prev => [...prev, user as NostrEvent])
                noteService.reactNote({ note: event as NDKEvent, reaction:"❣️" }).then(reaction => {
                    setReactions(prev => [...prev.filter(r => r.pubkey != user.pubkey), reaction as NostrEvent])
                })
            }
            if(reaction) {
                setReactions(prev => [...prev.filter(r => r.id != reaction.id)])
                noteService.deleteReact(reaction as NDKEvent)
            }
        }, 20)
    }

    const handleShowReplies = () => setShowReplies(true) 

    return (
        <View style={{ width: "100%", paddingVertical: 10 }}>
            <View style={{ width: "100%", flexDirection: "row" }}>
                <View style={{ width: "90%" }}>
                    <NoteViewer note={event as NDKEvent} />
                </View>
                <View style={{ width: "10%", alignItems: "center" }}>
                    <TouchableOpacity style={{ marginTop: 10 }} onPress={handleReact}>
                        <Ionicons name={reacted ? "heart" : "heart-outline"}
                            size={20} color={theme.colors.white} 
                        /> 
                    </TouchableOpacity>
                    <Text style={{ color: theme.colors.white, fontSize: 11 }}>
                        {reactions.length}
                    </Text>
                </View>
            </View>
            <View style={{ width: "100%", paddingTop: 4, flexDirection: "row" }}>
                <TouchableOpacity 
                    activeOpacity={.7} 
                    style={{  flexDirection: "row" }}
                >
                    <Text style={styles.textButton}>
                        {useTranslate("commons.replie")}
                    </Text>
                    <Ionicons style={styles.iconButton}
                        name="chevron-forward" size={13} 
                        color={theme.colors.gray}
                    />
                </TouchableOpacity>
                {!!replies.length &&
                    <TouchableOpacity 
                        activeOpacity={.7} onPress={handleShowReplies}
                        style={{ marginLeft: 10, flexDirection: "row" }}
                    >
                        <Text style={styles.textButton}>
                            {useTranslate("commons.replies")}({replies.length}) 
                        </Text>
                        <Ionicons style={styles.iconButton} 
                            name="chevron-forward" size={13} 
                            color={theme.colors.gray} 
                        />
                    </TouchableOpacity>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    textButton: { color: theme.colors.gray, fontWeight: "400", fontSize: 13 },
    iconButton: { marginVertical: 3 }
})

export default CommentItem
