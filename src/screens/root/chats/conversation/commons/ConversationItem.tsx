import { NDKEvent } from "@nostr-dev-kit/ndk-mobile";
import { MutableRefObject, memo, useCallback, useEffect, useRef, useState } from "react";
import { Vibration, View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { GestureHandlerRootView, PanGestureHandler } from "react-native-gesture-handler";
import { useTranslateService } from "@src/providers/TranslateProvider";
import useChatStore from "@services/zustand/useChatStore";
import Ionicons from "react-native-vector-icons/Ionicons"
import NoteViewer from "@components/nostr/event/NoteViewer";
import { User } from "@services/user/types/User";
import ReplyTool from "./ReplyTool";
import theme from "@src/theme";

interface ForwardProps {
    event: NDKEvent,
    label: string
}

const ForwardMark = ({ event, label }: ForwardProps) => {
    if(!event.tags.find(t => t[0] == "f" && t[1] == "forward"))
        return null

    return (
        <View style={{ paddingBottom: 4, flexDirection: "row" }}>
            <Ionicons name="arrow-redo" size={15} color={theme.colors.white} />
            <Text style={{ color: theme.colors.white, fontWeight: "500", marginHorizontal: 5 }}>
                {label}
            </Text>
        </View>
    )
}

interface ListItemProps {
    item: NDKEvent;
    items: NDKEvent[];
    index: number;
    focusIndex: number | null;
    user: User;
    follow: User;
    selectedItems: MutableRefObject<Set<NDKEvent>>;
    setReplyEvent: (event: NDKEvent|null) => void;
    focusReply: (index: number) => void;
}

const ListItemMessage = ({
    item, index, focusIndex, items, user, follow, selectedItems, 
    setReplyEvent, focusReply
}: ListItemProps) => {
   
    const selected = useRef(false)
    const { useTranslate } = useTranslateService()
    const isUser = item.pubkey === user.pubkey;
    const highlight = useRef(new Animated.Value(0)).current
    const translateX = useRef(new Animated.Value(0)).current
    const [event, setEvent] = useState<NDKEvent>(item);
    const { selectionMode, toggleSelectionMode } = useChatStore()

    useEffect(() => {
        if (focusIndex === index) lightAnimation() 
    }, [focusIndex]);

    useEffect(() => {
        if(!selectionMode && selected.current) {
            selected.current = false
            highlight.setValue(0)
        }
    }, [selectionMode])

    const decryptMessage = useCallback(async () => {
        if (event.content.includes("?iv=")) { 
            //const decrypted = await messageService.decrypt(item)
            await item.decrypt()
            // item.content = decrypted.content
            // setEvent(decrypted)
        }
    }, [])

    useEffect(() => { decryptMessage() }, [decryptMessage])
    
    const replyMessage = () => {
        setReplyEvent(item)
        Vibration.vibrate(35)
    }

    const lightAnimation = useCallback(() => {
        Animated.sequence([
            Animated.timing(highlight, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(highlight, {
                toValue: 0,
                duration: 2500,
                useNativeDriver: true,
            }),
        ]).start()
    }, [highlight])

    const handleOnPress = () => {
        if (selectionMode) {
            selected.current = !selected.current
            highlight.setValue(selected.current ? 1 : 0)

            if(!selectedItems.current.has(item)) 
                selectedItems.current.add(item)
            else 
                selectedItems.current.delete(item)
            
            if(selectedItems.current.size === 0)
                toggleSelectionMode(false)
        }
    }

    const handleSelectionMode = () => {
        highlight.setValue(1) 
        selected.current = true
        toggleSelectionMode(true)
        selectedItems.current.add(item)
        Vibration.vibrate(45);
    }

    const backgroundColor = highlight.interpolate({
        inputRange: [0,1],
        outputRange: ["transparent", theme.colors.disabled]
    })

    const handleSwipeEnd = (dx: number) => {
        if (dx > 60) replyMessage()
        Animated.spring(translateX, {
            toValue: 0,
            damping: 10,
            stiffness: 60,
            useNativeDriver: true
        }).start()
    }

    const onGestureEvent = Animated.event(
        [{ nativeEvent: { translationX: translateX } }],
        { useNativeDriver: false }
    )

    const onHandlerStateChange = (event: any) => {
        let { translationX, state } = event.nativeEvent
        if (state === 5) { // FINAL STATE
            handleSwipeEnd(translationX);
        }
    }

    return (
        <GestureHandlerRootView>
            <TouchableOpacity 
                activeOpacity={.7} 
                onPress={handleOnPress}
                delayLongPress={150} 
                onLongPress={handleSelectionMode}
            >
                <Animated.View
                    style={[styles.messageContainer, { backgroundColor },
                        { flexDirection: isUser ? "row-reverse" : "row" },
                    ]}
                >
                    <PanGestureHandler activeOffsetX={[-5,5]}
                        onGestureEvent={onGestureEvent}
                        onHandlerStateChange={onHandlerStateChange}
                    >
                        <Animated.View style={[
                            styles.contentMessage,
                            isUser ? styles.messageSended : styles.messageReceived,
                            { transform: [{ translateX }] } 
                        ]}>
                            <ForwardMark event={item} label={useTranslate("chat.labels.fowarded")} />
                            <ReplyTool 
                                user={user} 
                                event={item} 
                                follow={follow}
                                messages={items}
                                focusReply={focusReply}
                            />
                            <NoteViewer showUser={false} note={event} />
                            <View style={[styles.messageDetailBox, { flexDirection: isUser ? "row-reverse" : "row" }]}>
                                <Text style={{ fontSize: 11, fontWeight: "500", color: theme.colors.gray }}>
                                    {new Date((event.created_at ?? 1) * 1000).toDateString()}
                                </Text>
                            </View>
                        </Animated.View>
                    </PanGestureHandler> 
                </Animated.View>
            </TouchableOpacity>
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    messageContainer: { width: "100%", padding: 6, marginVertical: 1 },
    contentMessage: { maxWidth: "90%", padding: 10, borderBottomLeftRadius: 12, borderTopRightRadius: 12 },
    messageReceived: { backgroundColor: theme.colors.chat_received, borderBottomRightRadius: 12 },
    messageSended: { backgroundColor: theme.colors.chat_sended, borderTopLeftRadius: 12 },
    messageDetailBox: { width: "100%", flexDirection: "row-reverse", marginTop: 5 },
})

export default memo(ListItemMessage, (prev, next) => {
    return prev.item.id === next.item.id && prev.index !== next.focusIndex
})
