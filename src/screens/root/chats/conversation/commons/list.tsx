import { StyleSheet, FlatList } from "react-native"
import { User } from "@services/memory/types"
import { NDKEvent } from "@nostr-dev-kit/ndk"
import { MutableRefObject, RefObject, useCallback, useMemo } from "react"
import theme from "@/src/theme"
import ListItemMessage from "./listItem"
    
type Props = {
    user: User,
    follow: User,
    events: NDKEvent[],
    listRef: RefObject<FlatList>,
    highLigthIndex: MutableRefObject<number|null>,
    selectedItems: MutableRefObject<Set<NDKEvent>>,
    setReplyEvent: (event: NDKEvent|null, index: number|null) => void,
}

const ConversationList = ({ user, follow, listRef, events, highLigthIndex, 
    selectedItems, setReplyEvent }: Props) => {
  
    const memorizedEvents = useMemo(() => events, [events])

    const focusEvent = useCallback((index: number) => {
        try {
            if(index != -1) {
                listRef.current?.scrollToIndex({ viewPosition: .5, animated: true, index })
                highLigthIndex.current = index
                setTimeout(() => highLigthIndex.current = null, 350)
            }
        } catch {}
    }, [highLigthIndex, listRef])  

    const renderItem = useCallback(({ item, index }: { item: NDKEvent; index: number }) => (
            <ListItemMessage 
                item={item} index={index} 
                focusIndex={highLigthIndex.current} items={events} 
                user={user} follow={follow} selectedItems={selectedItems} 
                setReplyEvent={setReplyEvent} focusReply={focusEvent}
            />
        ), [
        highLigthIndex, events, user, follow, selectedItems, 
        setReplyEvent, focusEvent 
    ]);

    return (
        <FlatList inverted
            ref={listRef} 
            data={memorizedEvents}
            style={styles.scrollContainer}
            showsVerticalScrollIndicator 
            renderItem={renderItem} 
            keyExtractor={item => item.id}
        />
    )
}

const styles = StyleSheet.create({
    scrollContainer: { width: "100%", backgroundColor: theme.colors.transparent },
})

export default ConversationList


