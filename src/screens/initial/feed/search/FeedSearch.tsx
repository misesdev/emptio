import { StyleSheet, View, Text } from "react-native"
import { useEffect } from "react"
import theme from "@src/theme"

const FeedSearch = ({ navigation }: any) => {

    useEffect(() => {
        
    }, [])

    return (
        <View style={theme.styles.container} >
            <Text style={styles.title}>Search Feed</Text>
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

export default FeedSearch