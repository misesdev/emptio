import { StyleSheet, TextInput, View, Text } from "react-native"
import { useTranslate } from "@src/services/translate"
import { useAuth } from "@src/providers/userProvider"
import { formatSats, toNumber } from "@src/services/converter"
import theme from "@src/theme"

type AmountBoxProps = {
    value?: string | ""
    placeholder?: string,
    onChangeText: (text: string) => void,
    isValidHandle?: (valid: boolean) => void
}

export const AmountBox = ({ value, placeholder, onChangeText, isValidHandle }: AmountBoxProps) => {

    const { wallet } = useAuth()

    const hadleValidateFormat = (text: string) => {

        const textNumbers = toNumber(text)

        onChangeText(formatSats(textNumbers))

        if (isValidHandle) 
        {
            if (wallet?.lastBalance)
                isValidHandle(textNumbers > 0 && wallet?.lastBalance >= textNumbers)
            else
                isValidHandle(textNumbers > 0)
        }
    }

    return (
        <View style={styles.container}>
            <TextInput
                value={value}
                keyboardType="numeric"
                style={styles.amount}
                placeholder={placeholder}
                onChangeText={hadleValidateFormat}
                cursorColor={theme.colors.gray}
                textAlign="center"
                autoFocus
            />
            <Text style={styles.balance}>{`${useTranslate("wallet.subtitle.balance")}${formatSats(wallet.lastBalance)} sats.`}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "90%",
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 24,
        margin: 10
    },
    amount: {
        padding: 10,
        fontSize: 32,
        fontWeight: "bold",
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray,
        color: theme.colors.white,
    },
    balance: {
        fontSize: 14,
        marginVertical: 10,
        color: theme.colors.gray
    }
})
