import { FlatList, ScrollView } from "react-native-gesture-handler"
import { StyleSheet, View } from "react-native"
import NoteViewer from "../event/NoteViewer"
import theme from "@src/theme"
import { useCallback } from "react"

type NoteProps = { note: string }

const NoteItem = ({ note }: NoteProps) => {
    return (
        <View> 
            <ScrollView
                contentContainerStyle={{ minHeight: 300, justifyContent: "center" }}
                showsVerticalScrollIndicator 
                style={styles.scrollNote}
            >
                <View style={{ padding: 24 }}>
                    <NoteViewer note={note} />
                </View>
            </ScrollView>
        </View>
    )
}

type NoteListProps = { notes: string [] }

export const NoteList = ({ notes }: NoteListProps) => {
    
    const renderItem = useCallback(({ item }: { item: string }) => {
        return <NoteItem note={item}/>
    },[])

    return (
        <FlatList
            data={notes}
            horizontal
            pagingEnabled
            style={styles.scroll}
            renderItem={renderItem}
            showsHorizontalScrollIndicator={false}
        />
    )
}

const styles = StyleSheet.create({
    scroll: {
        width: "100%", 
        marginBottom: 10,
    },
    scrollNote: {
        height: 300, 
        margin: 6,
        width: 325,
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
