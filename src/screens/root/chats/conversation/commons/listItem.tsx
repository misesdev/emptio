import { User } from "@services/memory/types";
import { NDKEvent } from "@nostr-dev-kit/ndk-mobile";
import { MutableRefObject, useCallback, useEffect, useState } from "react";
import Animated, { interpolateColor, runOnJS, useAnimatedStyle, 
    useSharedValue, withSpring, withTiming } from "react-native-reanimated";
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
    selectedItems: MutableRefObject<NDKEvent[]>;
    replyEvent: MutableRefObject<NDKEvent|null>;
    focusEventOnList: (event: NDKEvent) => void;
}

const ListItemMessage = ({
    item, index, focusIndex, items, user, follow, selectionMode, selectedItems, replyEvent, focusEventOnList
}: ListItemProps) => {
    
    const threshold = 10;
    const highlight = useSharedValue(0);
    const translateX = useSharedValue(0);
    const isUser = item.pubkey === user.pubkey;
    const [event, setEvent] = useState<NDKEvent>(item);
    const [selected, setSelected] = useState(false);

    useEffect(() => {
        if (focusIndex === index) {
            highlight.value = 1;
            highlight.value = withTiming(0, { duration: 1800 });
        }
    }, [focusIndex]);

    useEffect(() => {
        if (event.content.includes("?iv=")) {
            messageService.decryptMessage(user, item).then(setEvent);
        }
    }, []);

    const replyMessage = useCallback(() => {
        replyEvent.current = event;
        Vibration.vibrate(35);
    }, [event, replyEvent]);

    const swipeGesture = Gesture.Pan()
        .activeOffsetX([-10, 10])
        .onUpdate(event => {
            if (event.translationX > threshold && event.translationX <= 100) {
                translateX.value = event.translationX;
            }
        })
        .onEnd(event => {
            if (event.translationX > 60) runOnJS(replyMessage)();
            translateX.value = withSpring(0, { damping: 10, stiffness: 50 });
        });

    const animatedSwipeStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const animatedFocusStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(highlight.value, [0, 1], ["transparent", theme.colors.disabled]),
    }));

    const handleOnPress = useCallback(() => {
        if (selectionMode.current) {
            if (!selected) {
                selectedItems.current.push(item);
            } else {
                selectedItems.current = selectedItems.current.filter(el => el !== item);
            }
            if (!selectedItems.current.length) selectionMode.current = false;
            setSelected(prev => !prev);
        }
    }, [selected, selectionMode, selectedItems, item]);

    const handleSelectionMode = useCallback(() => {
        setSelected(true);
        selectionMode.current = true;
        selectedItems.current.push(item);
        Vibration.vibrate(45);
    }, [selectionMode, selectedItems, item]);

    return (
        <Animated.View style={animatedFocusStyle}>
            <View style={[
                styles.messageContainer,
                { flexDirection: isUser ? "row-reverse" : "row" },
                { backgroundColor: selected ? theme.colors.blueOpacity : "transparent" }
            ]}>
                <GestureDetector gesture={swipeGesture}>
                    <Animated.View style={[
                        styles.contentMessage,
                        isUser ? styles.messageSended : styles.messageReceived,
                        animatedSwipeStyle
                    ]}>
                        <TouchableOpacity activeOpacity={0.7} onPress={handleOnPress} delayLongPress={100} onLongPress={handleSelectionMode}>
                            <ReplyTool user={user} event={item} follow={follow} messages={items} focusEventOnList={focusEventOnList} />
                            <NoteViewer showUser={false} note={event} />
                            <View style={[styles.messageDetailBox, { flexDirection: isUser ? "row-reverse" : "row" }]}>
                                <Text style={{ fontSize: 11, fontWeight: "500", color: theme.colors.gray }}>
                                    {new Date((event.created_at ?? 1) * 1000).toDateString()}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                </GestureDetector>
            </View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    messageContainer: { width: "100%", padding: 6, marginVertical: 1 },
    contentMessage: { width: "90%", padding: 10, borderBottomLeftRadius: 12, borderTopRightRadius: 12 },
    messageReceived: { backgroundColor: theme.colors.section, borderBottomRightRadius: 12 },
    messageSended: { backgroundColor: theme.colors.blueOpacity, borderTopLeftRadius: 12 },
    messageDetailBox: { width: "100%", flexDirection: "row-reverse", marginTop: 12 },
})

export default ListItemMessage
