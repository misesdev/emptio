import { HeaderScreen } from "@components/general/HeaderScreen"
import { StyleSheet, View } from "react-native"

const OrderPriceScreen = ({ navigation, route }: any) => {

    return (
        <View style={{ flex: 1 }}>
            <HeaderScreen
                title={"Price Order"}
                onClose={() => navigation.goBack()}
            />

        </View>
    )
}

const styles = StyleSheet.create({

})

export default OrderPriceScreen

