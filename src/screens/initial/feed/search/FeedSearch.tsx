import { StyleSheet, View, Text } from "react-native"
import theme from "@src/theme"
import { useEffect } from "react"
import { tabBarStyle } from "@src/constants/RouteSettings"

const FeedSearch = ({ navigation }: any) => {

    useEffect(() => {
        navigation.getParent()?.setOptions({ tabBarStyle: { display: "none" } })

        return () => navigation.getParent()?.setOptions({ tabBarStyle })
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