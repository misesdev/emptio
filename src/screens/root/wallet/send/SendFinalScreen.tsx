import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { ButtonPrimary } from "@components/form/Buttons"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { useTranslateService } from "@src/providers/TranslateProvider"
import { useService } from "@src/providers/ServiceProvider"
import { FeeRate } from "@services/wallet/types/FeeRate"
import { pushMessage } from "@services/notification"
import { useEffect, useState } from "react"
import { ActivityIndicator } from "react-native-paper"
import theme from "@src/theme"
import { Utilities } from "@/src/utils/Utilities"

type FeeType = "high" | "medium" | "low" | "minimun"

interface FeeProps {
    label: string,
    description: string,
    feeType: FeeType,
    selected: boolean,
    onPress: (value: FeeType) => void
}

const FeeOption = ({ label, description, feeType, onPress, selected }: FeeProps) => {
    return (
        <TouchableOpacity activeOpacity={.7}
            style={[styles.selection, { borderColor: selected ? 
                theme.colors.white : theme.colors.transparent }]}
            onPress={() => onPress(feeType)}
        >
            <View style={{ width: "100%", padding: 8, paddingHorizontal: 12 }}>
                <Text style={[styles.typeTitle, { color: theme.colors.white }]}>
                    {label}
                </Text>
                <Text style={styles.typeDescription}>
                    {description}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

const SendFinalScreen = ({ navigation, route }: any) => {

    const { wallet, amount, address, receiver, origin } = route.params
    const { useTranslate } = useTranslateService()
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(false)
    const [nextDisabled, setNextDisabled] = useState(true)
    const [selectedFee, setSelectedFee] = useState<FeeType>()
    const [recomendedFee, setRecomendedFee] = useState<FeeRate>()
    const [feeValue, setFeeValue] = useState<number>(0)
    const { walletService } = useService()
   
    useEffect(() => { loadRecomendedFee() }, []) 

    const loadRecomendedFee = async () => {
        const result = await walletService.getFeeRate()
        if(result.success && result.data)
            setRecomendedFee(result.data)
    }

    const handleSelectFee = (type: FeeType) => {
        setFetching(true)
        setSelectedFee(type)
        setNextDisabled(false)
        const feeValues = { 
            "high": recomendedFee?.fastestFee,
            "medium": recomendedFee?.halfHourFee,
            "low": recomendedFee?.hourFee,
            "minimun": recomendedFee?.minimumFee
        }
        setFeeValue(feeValues[type]??1)
        setFetching(false)
    }

    const handleSend = async () => {
        setLoading(true)
        setNextDisabled(true)
        // const result = await walletService.transaction.build({ 
        //     amount: toNumber(amount), 
        //     destination: address, 
        //     wallet,
        //     recomendedFee: feeValue
        // }) 

        // if (result.success) {
        //     const response = await walletService.transaction.send(result.data, wallet.network)
        //     if(response.success) {
        //         navigation.reset({
        //             index: origin == "donation" ? 0 : 1,
        //             routes: [
        //                 { name: 'core-stack' },
        //                 { name: 'wallet-stack', params: { wallet } }
        //             ]
        //         })
        //     }

        //     if (!result.success && result.message) {
        //         pushMessage(result.message)
        //     }
        // }

        // if (!result.success && result.message)
        //     pushMessage(result.message)

        setNextDisabled(false)
        setLoading(false)
    }

    return (
        <View style={styles.container}>
            <HeaderScreen
                title={useTranslate("wallet.title.transfer")}
                onClose={() => navigation.goBack()}
            />  
            
            <View style={{ width: "90%" }}>
                <Text style={styles.amount}>{amount} sats</Text>
                <Text style={styles.label}>
                    {useTranslate("commons.to")} {" "}
                    <Text style={styles.username}>
                        {!!receiver?.pubkey ? Utilities.getUserName(receiver) : useTranslate("chat.unknown")}
                    </Text>
                </Text>
                <Text style={styles.label}>
                    {useTranslate("wallet.transfer.address")} {" "}
                    <Text style={styles.username}>{Utilities.shortenString(address, 20)}</Text>
                </Text>
            </View>

            <Text style={styles.title}>{useTranslate("wallet.transfer.wantfeepay")}</Text>
            {fetching &&
                <View style={{ paddingVertical: 20 }}>
                    <ActivityIndicator size={20} color={theme.colors.white} />
                </View>
            }
            {!fetching &&
                <View style={{ width: "100%", alignItems: "center", marginVertical: 15 }}>
                    <FeeOption 
                        label={`${useTranslate("wallet.fee.high.title")} - ${recomendedFee?.fastestFee??0} sats/vb`} 
                        description={useTranslate("wallet.fee.high.description")}
                        feeType="high"
                        selected={selectedFee == "high"}
                        onPress={handleSelectFee}
                    />
                    <FeeOption 
                        label={`${useTranslate("wallet.fee.medium.title")} - ${recomendedFee?.halfHourFee??0} sats/vb`} 
                        description={useTranslate("wallet.fee.medium.description")}
                        feeType="medium"
                        selected={selectedFee == "medium"}
                        onPress={handleSelectFee}
                    />
                    <FeeOption 
                        label={`${useTranslate("wallet.fee.low.title")} - ${recomendedFee?.hourFee??0} sats/vb`} 
                        description={useTranslate("wallet.fee.low.description")}
                        feeType="low"
                        selected={selectedFee == "low"}
                        onPress={handleSelectFee}
                    />
                    <FeeOption 
                        label={`${useTranslate("wallet.fee.minimum.title")} - ${recomendedFee?.minimumFee??0} sats/vb`} 
                        description={useTranslate("wallet.fee.minimum.description")}
                        feeType="minimun"
                        selected={selectedFee == "minimun"}
                        onPress={handleSelectFee}
                    />
                </View>
            }

            <View style={styles.buttonArea}>
                <ButtonPrimary 
                    disabled={nextDisabled}
                    label={useTranslate("commons.send")}
                    onPress={handleSend}
                    loading={loading}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', backgroundColor: theme.colors.black },
    title: { fontSize: 26, maxWidth: "80%", fontWeight: "bold", textAlign: "center", 
        marginVertical: 15, color: theme.colors.white },
    amount: { fontSize: 36, maxWidth: "80%", fontWeight: "bold", marginVertical: 10, 
        color: theme.colors.white },
    label: { fontSize: 16, color: theme.colors.gray, marginVertical: 5 }, 
    username: { fontSize: 14, color: theme.colors.white, fontWeight: "500" },
    selection: { width: "94%", borderRadius: 10, flexDirection: "row", borderWidth: 1,
        backgroundColor: theme.colors.blueOpacity, marginVertical: 5 },
    typeTitle: { fontSize: 16, fontWeight: "bold", color: theme.colors.white },
    typeDescription: { marginBottom: 15, color: theme.colors.gray },
    buttonArea: { width: "100%", justifyContent: "center", alignItems: "center" }
})

export default SendFinalScreen
