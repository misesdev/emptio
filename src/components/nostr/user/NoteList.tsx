import { FlatList, ScrollView } from "react-native-gesture-handler"
import { Dimensions, StyleSheet, View } from "react-native"
import NoteViewer from "../event/NoteViewer"
import theme from "@src/theme"
import { useCallback, useRef, useState } from "react"

type NoteProps = { 
    note: string, 
    videoMuted?: boolean, 
    setVideoMuted?: (muted: boolean) => void, 
    videoPaused?: boolean
}

const NoteItem = ({ note, videoMuted=true, setVideoMuted, videoPaused=true }: NoteProps) => {

    const scrollRef = useRef(null)
    const { width } = Dimensions.get("window")
    const noteWidth = width * .8

    return (
        <View> 
            <ScrollView ref={scrollRef}
                contentContainerStyle={{ minHeight: 300 }}
                showsVerticalScrollIndicator 
                style={[styles.scrollNote, { width: noteWidth }]}
            >
                <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
                    <NoteViewer setMutedVideo={setVideoMuted} videoMuted={videoMuted} videoPaused={videoPaused} note={note} />
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
    const [videoMuted, setVideoMuted] = useState<boolean>(false)

    const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
        const playing = (viewableItems.length > 0 && isVisible) ? viewableItems[0].index : null 
        setPlayingIndex(playing)
    }, [isVisible])

    const renderItem = useCallback(({ item, index }: { item: string, index: number }) => {
        return <NoteItem 
            note={item} 
            videoMuted={videoMuted}
            setVideoMuted={setVideoMuted}
            videoPaused={index != playingIndex}
        />
    },[playingIndex, isVisible])

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
        height: 340, 
        margin: 6,
        borderRadius: 10,
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
