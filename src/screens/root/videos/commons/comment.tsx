import NoteViewer from "@components/nostr/event/NoteViewer"
import { NDKEvent, NDKFilter, NDKKind, NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk-mobile"
import { TouchableOpacity, View, Text, StyleSheet } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import theme from "@src/theme"
import { useTranslateService } from "@src/providers/translateProvider"
import useNDKStore from "@services/zustand/ndk"
import { useEffect, useState } from "react"
import { useAuth } from "@src/providers/userProvider"
import { noteService } from "@services/nostr/noteService"

interface CommentItemProps {
    event: NDKEvent,
    replies: NDKEvent[]
}

const CommentItem = ({ event, replies }: CommentItemProps) => {
   
    const { user } = useAuth()
    const { ndk } = useNDKStore()
    const { useTranslate } = useTranslateService()
    const [showReplies, setShowReplies] = useState(false)
    const [reacted, setReacted] = useState<boolean>(false)
    const [reactions, setReactions] = useState<NDKEvent[]>([])

    useEffect(() => { setTimeout(fetchReactions, 20) }, [])
        
    const fetchReactions = async () => {
        const filter: NDKFilter = { kinds: [NDKKind.Reaction], "#e": [event.id] }
        const subscription = ndk.subscribe(filter, {
            cacheUsage: NDKSubscriptionCacheUsage.ONLY_RELAY
        })        
        subscription.on("event", event => setReactions(prev => [...prev, event]))

        const finish = () => { 
            subscription.removeAllListeners()
            setTimeout(() => {
                setReacted(reactions.some(r => r.pubkey == user.pubkey))
            }, 20)
        }

        subscription.on("close", finish)
        subscription.on("eose", finish)

        setTimeout(() => {
            subscription.stop()
        }, 1000)
    }

    const handleReact = () => {
        setReacted(prev => !prev)
        setTimeout(() => {
            const reaction = reactions.find(r => r.pubkey == user.pubkey)
            if(!reaction) {
                setReactions(prev => [...prev, user as NDKEvent])
                noteService.reactNote({ note: event, reaction:"❣️" }).then(reaction => {
                    setReactions(prev => [...prev.filter(r => r.pubkey != user.pubkey), reaction])
                })
            }
            if(reaction) {
                setReactions(prev => [...prev.filter(r => r.id != reaction.id)])
                noteService.deleteReact(reaction)
            }
        }, 20)
    }

    const handleShowReplies = () => setShowReplies(true) 

    return (
        <View style={{ width: "100%", paddingVertical: 10 }}>
            <View style={{ width: "100%", flexDirection: "row" }}>
                <View style={{ width: "90%" }}>
                    <NoteViewer note={event} />
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
    textButton: { color: theme.colors.gray, fontWeight: "bold", fontSize: 13 },
    iconButton: { margin: 2, fontWeight: "bold" }
})

export default CommentItem
