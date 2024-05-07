import theme from "@/src/theme"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { useState } from "react"
import { ScrollView, StyleSheet, Text, View } from "react-native"

const TransactionScreen = ({ navigation, route }: any) => {

    const [transaction, setTransaction] = useState(route.params)

    return (
        <>
            <HeaderScreen title="Transaction" onClose={() => navigation.navigate("wallet-stack")} />
            <ScrollView contentContainerStyle={theme.styles.scroll_container}>
                <Text style={styles.title}></Text>
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    title: { fontSize: 20, fontWeight: "bold", color: theme.colors.white }
})

export default TransactionScreen