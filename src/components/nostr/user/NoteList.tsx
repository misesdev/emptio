import { ScrollView } from "react-native-gesture-handler"
import { SafeAreaView, StyleSheet, Text } from "react-native"
import theme from "@/src/theme"
import { View } from "react-native-animatable"
import NoteViewer from "../event/NoteViewer"

type NoteProps = { note: string }

const NoteItem = ({ note }: NoteProps) => {
    return (
        <View> 
            <ScrollView showsVerticalScrollIndicator style={styles.scrollNote}>
                {/* <View style={styles.viewNote}> */}
                {/*     <Text style={styles.note}>{note?.trim() ?? ""}</Text> */}
                {/* </View> */}
                <NoteViewer note={note} />
                <View style={{ height: 50 }}></View>
            </ScrollView>
        </View>
    )
}

type NoteListProps = { notes: string [] }

export const NoteList = ({ notes }: NoteListProps) => {
    
    return (
        <ScrollView 
            pagingEnabled 
            horizontal
            style={styles.scroll}
            showsHorizontalScrollIndicator={false}
        >
            {
                notes.reverse().map((note, key) => <NoteItem key={key} note={note} />)
            }
        </ScrollView>
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
        padding: 20,
        width: 325,
        borderRadius: 14,
        backgroundColor: theme.colors.black,
    },
    note: { 
        //textAlign: "center",
        color: theme.colors.gray, 
    },
    viewNote: { 
        height: 'auto',
        marginVertical: 20
    }
})
