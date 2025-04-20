import { useState } from "react"
import { StyleSheet, Modal, View, TextInput, TouchableOpacity, Text } from "react-native"
import { Currency } from "@src/constants/Currencies"
import Ionicons from "react-native-vector-icons/Ionicons"
import theme from "@src/theme"
import { CurrencyList } from "./CurrencyList"
import { toNumber } from "@services/converter"
import { formatCurrency } from "@services/converter/currency"
import { useSettings } from "@src/providers/settingsProvider"
import { storageService } from "@services/memory"

interface CurrencySelectorProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    onSelectCurrency: (currency: Currency) => void;
}

const CurrencySelector = ({ visible, setVisible, onSelectCurrency }: CurrencySelectorProps) => {
    return (
        <Modal visible={visible} transparent animationType="slide"
            onRequestClose={() => setVisible(false)}>
            <View style={styles.overlayer}>
                <View style={styles.modalContainer}>
                    <View style={theme.styles.row}>
                        <CurrencyList onPress={onSelectCurrency} />
                    </View>
                </View>
            </View>
        </Modal>
    )
}

interface CurrencyInputProps {
    value: string,
    label?: string,
    onChange: (value: string) => void,
    autoFocus?: boolean
}

export const CurrencyInput = ({ label, value, onChange, autoFocus=false }: CurrencyInputProps) => {
  
    const { settings, setSettings } = useSettings()
    const [selectorVisible, setSelectorVisible] = useState<boolean>(false)

    const changeFormat = (text: string) => {
        const textNumbers = toNumber(text)
        onChange(formatCurrency(textNumbers, settings.currency?.code))
    }

    const openCurrencySelector = () => {
        setSelectorVisible(true)
    }

    const onSelectCurrency = (currency: Currency) => {
        if(setSettings) setSettings({...settings, currency })
        onChange(formatCurrency(toNumber(value), currency?.code))
        storageService.settings.save({
            ...settings,
            currency
        })
        setSelectorVisible(false)
    }

    return (
        <View style={styles.container}>
            <View style={{ width: "100%", flexDirection: "row" }}>
                <View style={{ width: "15%" }}>
                    <TouchableOpacity activeOpacity={.6}
                        style={styles.buttonMoney} onPress={openCurrencySelector}
                    >
                        <Text style={styles.currencyFlag}>{settings.currency?.flag}</Text>
                        <Text style={[styles.currencyCode, styles.shadow]}>{settings.currency?.code}</Text> 
                        <Text style={{ textAlign: "center" }}>
                            <Ionicons style={styles.shadow} name="chevron-down" size={12} color={theme.colors.white} />
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ width: "85%" }}>
                    <TextInput
                        value={value}
                        keyboardType="numeric"
                        style={styles.input}
                        onChangeText={changeFormat}
                        cursorColor={theme.colors.gray}
                        autoFocus={autoFocus}
                        multiline={false}
                    />
                </View>
            </View>
            {label &&
                <Text style={styles.label}>
                    {label}
                </Text>
            }
            <CurrencySelector
                visible={selectorVisible}
                setVisible={setSelectorVisible}
                onSelectCurrency={onSelectCurrency} 
            />
        </View>
    ) 
}

const styles = StyleSheet.create({
    overlayer: { flex: 1, justifyContent: "flex-end", backgroundColor: theme.colors.transparent,
        padding: 6 },
    modalContainer: { height: "65%", backgroundColor: theme.colors.semitransparentdark,
        borderRadius: 10, padding: 12 },
    
    container: { width: "90%", paddingHorizontal: 20, paddingVertical: 15, borderRadius: 10, 
        margin: 10, padding: 10, backgroundColor: "rgba(0, 55, 55, .2)" },
    input: { padding: 10, fontSize: 26, fontWeight: "bold", borderBottomWidth: 1, 
        borderBottomColor: theme.colors.gray, color: theme.colors.white },

    buttonMoney: { borderRadius: 10, overflow: "hidden", width: "100%", height: 55,
       alignItems: "center", justifyContent: "center"  },
    label: { fontSize: 14, marginVertical: 10, color: theme.colors.gray },
    currencyCode: { color: theme.colors.white, fontSize: 16, fontWeight: "500",
        textAlign: "center" },
    currencyFlag: { position: "absolute", fontSize: 40, opacity: 0.7 },

    shadow: { textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 6, textShadowColor: theme.colors.semitransparentdark }
})

