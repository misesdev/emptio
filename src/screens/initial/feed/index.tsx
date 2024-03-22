import { StyleSheet, View, Text } from "react-native"
import theme from "@src/theme"
import { useEffect } from "react"
import { createHeaderFeed } from "@screens/initial/headers"

const Feed = ({ navigation }: any) => {

    useEffect(() => {
        createHeaderFeed(navigation)
    }, [])

    return (
        <View style={theme.styles.container} >
            <Text style={styles.title}>Feed</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.colors.gray
    }
})

export default Feed