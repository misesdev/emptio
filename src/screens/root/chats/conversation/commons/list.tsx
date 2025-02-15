import { StyleSheet, FlatList } from "react-native"
import { User } from "@services/memory/types"
import { NDKEvent } from "@nostr-dev-kit/ndk"
import { MutableRefObject, RefObject, useCallback } from "react"
import theme from "@/src/theme"
import ListItemMessage from "./listItem"
    
type Props = {
    user: User,
    follow: User,
    events: NDKEvent[],
    listRef: RefObject<FlatList>,
    highLigthIndex: MutableRefObject<number|null>,
    selectionMode: MutableRefObject<boolean>,
    selectedItems: MutableRefObject<NDKEvent[]>,
    replyEvent: MutableRefObject<NDKEvent|null>,
    focusEventOnList: (event: NDKEvent) => void,
}

const ConversationList = ({ user, follow, listRef, events, selectionMode, highLigthIndex, 
    selectedItems, replyEvent, focusEventOnList }: Props) => {
   
    const renderItem = useCallback(({ item, index }: { item: NDKEvent; index: number }) => (
        <ListItemMessage item={item} index={index} focusIndex={highLigthIndex.current} items={events} 
            user={user} follow={follow} selectionMode={selectionMode} 
            selectedItems={selectedItems} replyEvent={replyEvent} focusEventOnList={focusEventOnList} 
        />
    ), [highLigthIndex, events, user, follow, selectionMode, selectedItems, replyEvent, focusEventOnList]);

    return (
        <FlatList ref={listRef} inverted data={events} style={styles.scrollContainer}
            showsVerticalScrollIndicator renderItem={renderItem} keyExtractor={item => item.id} 
        />
    )
}

const styles = StyleSheet.create({
    scrollContainer: { width: "100%", backgroundColor: theme.colors.black },
})

export default ConversationList


