import { FlatList, ScrollView } from "react-native-gesture-handler"
import { Dimensions, StyleSheet, View } from "react-native"
import NoteViewer from "../event/NoteViewer"
import theme from "@src/theme"
import { useCallback, useRef, useState } from "react"

type NoteProps = { note: string, videoPaused?: boolean }

const NoteItem = ({ note, videoPaused = true }: NoteProps) => {

    const scrollRef = useRef(null)
    const { width } = Dimensions.get("window")
    const noteWidth = width * .8

    return (
        <View> 
            <ScrollView ref={scrollRef}
                contentContainerStyle={{ minHeight: 300, justifyContent: "center" }}
                showsVerticalScrollIndicator 
                style={[styles.scrollNote, { width: noteWidth }]}
            >
                <View style={{ padding: 24 }}>
                    <NoteViewer videoPaused={videoPaused} note={note} />
                </View>
            </ScrollView>
        </View>
    )
}

type NoteListProps = {
    notes: string [],
    horizontal?: boolean,
    pagingEnabled?: boolean,
    isVisible: boolean
}

export const NoteList = ({ notes, isVisible, horizontal=true, pagingEnabled=true }: NoteListProps) => {
    
    const listRef = useRef(null)
    const [playingIndex, setPlayingIndex] = useState(null)

    // Detecta o item visível
    const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setPlayingIndex(viewableItems[0].index);
        }
    }, [isVisible])

    const renderItem = useCallback(({ item, index }: { item: string, index: number }) => {
        return <NoteItem note={item} videoPaused={index != playingIndex}/>
    },[playingIndex])

    if(!isVisible) setPlayingIndex(null)

    return (
        <FlatList
            data={notes}
            ref={listRef}
            horizontal={horizontal}
            pagingEnabled={pagingEnabled}
            style={styles.scroll}
            renderItem={renderItem}
            removeClippedSubviews
            showsHorizontalScrollIndicator={false}
            keyExtractor={(index) => index.toString()}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
        />
    )
}

const styles = StyleSheet.create({
    scroll: {
        width: "100%", 
        marginBottom: 10,
    },
    scrollNote: {
        height: 320, 
        margin: 6,
        borderRadius: 14,
        backgroundColor: theme.colors.black,
    },
    note: { 
        color: theme.colors.gray, 
    },
    viewNote: {
        flex: 1,
        height: 'auto',
        marginVertical: 20
    }
})
