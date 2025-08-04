import { FlatList, ScrollView } from "react-native-gesture-handler"
import { Dimensions, StyleSheet, View } from "react-native"
import NoteViewer from "../event/NoteViewer"
import { useCallback, useRef, useState } from "react"
import { NDKEvent } from "@nostr-dev-kit/ndk-mobile"
import { User } from "@services/user/types/User"
import theme from "@src/theme"

interface NoteProps {
    user?: User,
    note: NDKEvent, 
    videoMuted?: boolean, 
    setVideoMuted?: (muted: boolean) => void, 
    videoPaused?: boolean
}

const NoteItem = ({ user, note, videoMuted=true, setVideoMuted, videoPaused=true }: NoteProps) => {

    const { width } = Dimensions.get("window")
    const noteWidth = width * .76

    return (
        <ScrollView 
            showsVerticalScrollIndicator 
            contentContainerStyle={{ minHeight: 300 }}
            style={[styles.scrollNote, { width: noteWidth }]}
        >
            <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
                <NoteViewer author={user} setMutedVideo={setVideoMuted} videoMuted={videoMuted} videoPaused={videoPaused} note={note} />
            </View>
        </ScrollView>
    )
}

interface NoteListProps {
    user?: User,
    notes: NDKEvent[],
    horizontal?: boolean,
    pagingEnabled?: boolean,
    isVisible: boolean,
}

export const NoteList = ({ user, notes, isVisible, horizontal=true, pagingEnabled=true }: NoteListProps) => {
    
    const listRef = useRef(null)
    const [playingIndex, setPlayingIndex] = useState(null)
    const [videoMuted, setVideoMuted] = useState<boolean>(false)

    const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
        const playing = (viewableItems.length > 0 && isVisible) ? viewableItems[0].index : null 
        setPlayingIndex(playing)
    }, [isVisible])

    const renderItem = useCallback(({ item, index }: { item: NDKEvent, index: number }) => {
        return <NoteItem 
            user={user} note={item} 
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
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
            snapToAlignment="center"
            decelerationRate="fast"
        />
    )
}

const styles = StyleSheet.create({
    scroll: { width: "100%", marginBottom: 10 },
    scrollNote: { height: 340, margin: 6, borderRadius: 10, backgroundColor: theme.colors.black },
    note: { color: theme.colors.gray },
    viewNote: { flex: 1, height: 'auto', marginVertical: 20 }
})
