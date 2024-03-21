import { StyleSheet, View, Text } from "react-native"
import theme from "@src/theme"
import { useEffect } from "react"
import { createHeaderFeed } from "./headers"


const Feed = ({ navigation }: any) => {

    useEffect(() => {
        createHeaderFeed(navigation)
    }, [])

    return (
        <View style={styles.container} >
            <Text style={styles.title}>Feed</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.COLORS.BLACK
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.COLORS.WHITE
    }
})

export default Feed