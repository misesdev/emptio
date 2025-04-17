import Currencies, { Currency } from "@/src/constants/Currencies"
import { useTranslateService } from "@src/providers/translateProvider"
import { TranslateWords } from "@services/translate/types"
import { FlatList, StyleSheet, View, Text, TouchableOpacity } from "react-native"
import theme from "@src/theme"

interface CurrencyListProps {
    onPress: (currency: Currency) => void
}

export const CurrencyList = ({ onPress }: CurrencyListProps) => {

    const { useTranslate } = useTranslateService()

    const renderItem = ({ item }: { item: Currency }) => {
        return (
            <TouchableOpacity activeOpacity={.6} onPress={() => onPress(item)}
                style={styles.item}
            >
                <View style={{ width: "100%", flexDirection: "row" }}>
                    <View style={{ width: "20%" }}>
                        <View style={styles.flagContainer}>
                            <Text style={styles.currencyFlag}>{item.flag}</Text>
                        </View>
                    </View>
                    <View style={{ width: "80%", padding: 6 }}>
                        <Text style={styles.currencyCode}>
                            {item.code}
                        </Text>
                        <Text style={styles.currencyName}>
                            {item.symbol} {useTranslate(item.label as TranslateWords)}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    
    return (
        <FlatList 
            data={Currencies}
            renderItem={renderItem}
        />
    )
}

const styles = StyleSheet.create({
    item: { width: "100%", padding: 10, backgroundColor: "rgba(0, 55, 55, .2)", 
        borderRadius: 10, marginVertical: 1 },
    flagContainer: { alignItems: "center", justifyContent: "center", borderRadius: 50,
        width: 50, height: 50, overflow: "hidden" },
    currencyFlag: { position: "absolute", fontSize: 35, opacity: 0.7 },

    currencyCode: { color: theme.colors.white, fontSize: 16, fontWeight: "500" },
    currencyName: { color: theme.colors.gray, fontSize: 12 },
})
