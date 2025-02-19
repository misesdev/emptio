import { User } from "@services/memory/types";
import { NDKEvent } from "@nostr-dev-kit/ndk-mobile";
import { MutableRefObject, useCallback, useEffect, useState } from "react";
import Animated, { interpolateColor, runOnJS, useAnimatedStyle, 
    useDerivedValue, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { messageService } from "@src/core/messageManager";
import { Vibration, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import ReplyTool from "./replyTool";
import NoteViewer from "@components/nostr/event/NoteViewer";
import theme from "@src/theme";

interface ListItemProps {
    item: NDKEvent;
    items: NDKEvent[];
    index: number;
    focusIndex: number | null;
    user: User;
    follow: User;
    selectionMode: MutableRefObject<boolean>;
    selectedItems: MutableRefObject<Set<NDKEvent>>;
    setReplyEvent: (event: NDKEvent|null, index: number) => void;
    focusReply: (index: number) => void;
}

const ListItemMessage = ({
    item, index, focusIndex, items, user, follow, selectionMode, selectedItems, 
    setReplyEvent, focusReply
}: ListItemProps) => {
    
    const highlight = useSharedValue(0);
    const translateX = useSharedValue(0);
    const isUser = item.pubkey === user.pubkey;
    const [event, setEvent] = useState<NDKEvent>(item);

    useEffect(() => {
        if (focusIndex === index) {
            highlight.value = 1;
            highlight.value = withTiming(0, { duration: 800 });
        }
    }, [focusIndex]);

    useEffect(() => {
        if(!selectionMode.current) highlight.value = 0
    }, [selectionMode.current])

    useEffect(() => {
        if (event.content.includes("?iv=")) {
            messageService.decryptMessage(user, item).then(setEvent);
        }
    }, []);

    const replyMessage = useCallback(() => {
        setReplyEvent(event, index)
        Vibration.vibrate(35)
    }, [event, index])

    const swipeGesture = Gesture.Pan()
        .activeOffsetX([-15, 15])
        .onUpdate(event => translateX.value = event.translationX)
        .onEnd(event => {
            if (event.translationX > 60) runOnJS(replyMessage)();
            translateX.value = withSpring(0, { damping: 10, stiffness: 50 });
        });
    
    const limitedTranslation = useDerivedValue(() => {
        return Math.min(translateX.value, 100);
    })

    const animatedSwipeStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: limitedTranslation.value }],
    }));

    const animatedBackground = useDerivedValue(() => {
        return interpolateColor(highlight.value, [0, 1], ["transparent", theme.colors.disabled]);
    })

    const animatedFocusStyle = useAnimatedStyle(() => ({
        backgroundColor: animatedBackground.value
    }));

    const handleOnPress = useCallback(() => {
        if (selectionMode.current) {
            highlight.value = highlight.value == 1 ? 0 : 1
            if (!selectedItems.current.has(item)) {
                selectedItems.current.add(item);
            } else {
                selectedItems.current.delete(item);
            }
            selectionMode.current = (!!selectedItems.current.size);
        }
    }, [selectionMode, selectedItems, item]);

    const handleSelectionMode = useCallback(() => {
        highlight.value = 1 
        selectionMode.current = true;
        selectedItems.current.add(item);
        Vibration.vibrate(45);
    }, [selectionMode, selectedItems, item]);

    return (
        <Animated.View 
            style={[
                styles.messageContainer, animatedFocusStyle,
                { flexDirection: isUser ? "row-reverse" : "row" },
            ]}
        >
            <GestureDetector gesture={swipeGesture}>
                <Animated.View style={[
                    styles.contentMessage,
                    isUser ? styles.messageSended : styles.messageReceived,
                    animatedSwipeStyle
                ]}>
                    <TouchableOpacity 
                        activeOpacity={0.5} 
                        onPress={handleOnPress}
                        delayLongPress={150} 
                        onLongPress={handleSelectionMode}
                    >
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
                    </TouchableOpacity>
                </Animated.View>
            </GestureDetector>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    messageContainer: { width: "100%", padding: 6, marginVertical: 1 },
    contentMessage: { width: "90%", padding: 10, borderBottomLeftRadius: 12, borderTopRightRadius: 12 },
    messageReceived: { backgroundColor: theme.colors.chat_received, borderBottomRightRadius: 12 },
    messageSended: { backgroundColor: theme.colors.chat_sended, borderTopLeftRadius: 12 },
    messageDetailBox: { width: "100%", flexDirection: "row-reverse", marginTop: 12 },
})

export default ListItemMessage
