import { StyleSheet, View, Text } from "react-native"
import theme from "@src/theme"
import { useEffect, useState } from "react"

const Settings = ({ navigation }: any) => {

    useEffect(() => {

    }, [])

    return (
        <View style={theme.styles.container} >
            <Text style={styles.title}>Settings</Text>
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

export default Settings