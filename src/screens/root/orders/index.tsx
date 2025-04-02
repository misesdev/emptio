import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native"
import { SectionContainer } from "@components/general/section"
import { ButtonDanger, ButtonSuccess } from "@components/form/Buttons"
import { useAuth } from "@src/providers/userProvider"
import { memo, useEffect } from "react"
import { useTranslateService } from "@/src/providers/translateProvider"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { StackScreenProps } from "@react-navigation/stack"
import { pushMessage } from "@services/notification"
import { HeaderFeed } from "./header"
import useOrderStore from "@services/zustand/orders"
import { Order } from "@services/types/order"
import theme from "@src/theme"

const FeedOrdersScreen = ({ navigation }: StackScreenProps<any>) => {

    const { wallets } = useAuth()
    const { orders } = useOrderStore()
    const { useTranslate } = useTranslateService()

    const ListItem = memo(({ item }: { item: Order }) => {
         
        return (
            <SectionContainer style={{ backgroundColor: theme.colors.blueOpacity }}>
                <Text style={{ fontSize: 16, color: theme.colors.gray, margin: 10, textAlign: "center" }}>
                    Sell Order R$ {(item.price * 100).toFixed(2)}
                </Text>
                <View style={{ width: "100%", flexDirection: "row", alignItems: "center" }}>
                    <ButtonSuccess label="Buy" onPress={() => { }} />
                    <ButtonDanger label="Sell" onPress={() => { }} />
                </View>
            </SectionContainer>
        )
    })

    const EmptyComponent = () => (
        <Text style={styles.empty}>
            {useTranslate("feed.empty")}
        </Text>
    )

    const newOrder = () => {
        if(!wallets.length)
            return pushMessage(useTranslate("message.wallet.alertcreate"))

        navigation.navigate("feed-order-new")
    }

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.black }}>
            <HeaderFeed navigation={navigation} />
            <FlatList
                data={orders}
                renderItem={({ item }) => <ListItem item={item}/>}
                ListEmptyComponent={EmptyComponent}
                onEndReachedThreshold={.1}
                contentContainerStyle={[theme.styles.scroll_container]}
                keyExtractor={event => event.id ?? ""}
            />

            <View style={styles.rightButton}>
                <TouchableOpacity activeOpacity={.7} style={styles.newOrderButton} onPress={newOrder}>
                    <Ionicons name="add" size={theme.icons.medium} color={theme.colors.white} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    newOrderButton: { backgroundColor: theme.colors.blue, padding: 18, borderRadius: 50 },
    rightButton: { position: "absolute", bottom: 8, right: 0, width: 90, height: 70,
        justifyContent: "center", alignItems: "center" },
    empty: { width: "80%", color: theme.colors.gray, marginTop: 200, textAlign: "center" }
})

export default FeedOrdersScreen
