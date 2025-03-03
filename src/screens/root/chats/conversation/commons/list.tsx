import { StyleSheet, FlatList } from "react-native"
import { User } from "@services/memory/types"
import { NDKEvent } from "@nostr-dev-kit/ndk"
import { MutableRefObject, RefObject, useCallback } from "react"
import theme from "@src/theme"
import ListItemMessage from "./listItem"
    
type Props = {
    user: User,
    follow: User,
    events: NDKEvent[],
    listRef: RefObject<FlatList>,
    highLigthIndex: number|null,
    setHighlightIndex: (index: number|null) => void,
    selectedItems: MutableRefObject<Set<NDKEvent>>,
    setReplyEvent: (event: NDKEvent|null) => void,
}

const ConversationList = ({ user, follow, listRef, events, highLigthIndex, 
    selectedItems, setHighlightIndex, setReplyEvent }: Props) => {
  
    const focusEvent = useCallback((index: number) => {
        try {
            if(index != -1) {
                listRef.current?.scrollToIndex({ viewPosition: .5, animated: true, index })
                setHighlightIndex(index)
                // setTimeout(() => setHighlightIndex(null), 350)
            }
        } catch {}
    }, [highLigthIndex, setHighlightIndex, listRef])  

    const renderItem = useCallback(({ item, index }: { item: NDKEvent; index: number }) => (
            <ListItemMessage 
                item={item} index={index} 
                focusIndex={highLigthIndex} items={events} 
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
            data={events}
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


