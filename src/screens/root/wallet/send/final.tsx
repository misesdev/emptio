import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { FeesRecommended } from "@mempool/mempool.js/lib/interfaces/bitcoin/fees"
import { ButtonPrimary } from "@components/form/Buttons"
import { toNumber } from "@services/converter"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { pushMessage } from "@services/notification"
import { useTranslateService } from "@src/providers/translateProvider"
import { useEffect, useState } from "react"
import { walletService } from "@services/wallet"
import { BNetwork } from "bitcoin-tx-lib"
import { getUserName, shortenString } from "@/src/utils"
import { getFee } from "@services/bitcoin/mempool"
import theme from "@src/theme"

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

    const { wallet, amount, address, user } = route.params
    const { useTranslate } = useTranslateService()
    const [loading, setLoading] = useState(false)
    const [nextDisabled, setNextDisabled] = useState(true)
    const [selectedFee, setSelectedFee] = useState<FeeType>()
    const [recomendedFee, setRecomendedFee] = useState<FeesRecommended>()
    const [feeValue, setFeeValue] = useState<number>(0)
   
    useEffect(() => { loadRecomendedFee() }, []) 

    const loadRecomendedFee = async () => {
        const recomendedFees = await getFee(wallet.type == "bitcoin" ? "mainnet":"testnet")
        setRecomendedFee(recomendedFees)
    }

    const handleSelectFee = (type: FeeType) => {
        setSelectedFee(type)
        setNextDisabled(false)
        const feeValues = { 
            "high": recomendedFee?.fastestFee,
            "medium": recomendedFee?.halfHourFee,
            "low": recomendedFee?.hourFee,
            "minimun": recomendedFee?.minimumFee
        }
        setFeeValue(feeValues[type]??1)
    }

    const handleSend = async () => {

        setLoading(true)
        setNextDisabled(true)

        const result = await walletService.transaction.build({ 
            amount: toNumber(amount), 
            destination: address, 
            walletKey: wallet.key ?? "",
            recomendedFee: feeValue
        })

        if (result.success) {
            const network: BNetwork = wallet.type == "bitcoin" ? "mainnet" : "testnet"
            await walletService.transaction.send(result.data, network)
        }

        if (!result.success && result.message)
            pushMessage(result.message)

        setNextDisabled(false)
        setLoading(false)
    }

    return (
        <View style={styles.container}>
            <HeaderScreen
                title={"Transferir"}
                onClose={() => navigation.goBack()}
            />  
            
            <View style={{ width: "90%" }}>
                <Text style={styles.amount}>{amount} sats</Text>
                <Text style={styles.label}>
                    para {" "}
                    <Text style={styles.username}>
                        {user.pubkey ? getUserName(user) : useTranslate("chat.unknown")}
                    </Text>
                </Text>
                <Text style={styles.label}>
                    address {" "}
                    <Text style={styles.username}>{shortenString(address, 20)}</Text>
                </Text>
            </View>

            <Text style={styles.title}>Qual taxa de rede deseja pagar?</Text>
           
            <View style={{ width: "100%", alignItems: "center", marginVertical: 15 }}>
                <FeeOption 
                    label={`Prioridade alta - ${recomendedFee?.fastestFee??0} sats/vb`} 
                    description="Taxa recomendada para confirmar a transação o mais rápido possível, geralmente no próximo bloco."
                    feeType="high"
                    selected={selectedFee == "high"}
                    onPress={handleSelectFee}
                />
                <FeeOption 
                    label={`Prioridade media - ${recomendedFee?.halfHourFee??0} sats/vb`} 
                    description="Taxa recomendada para confirmar a transação dentro de 30 minutos (ou seja, dentro de aproximadamente 3 blocos)."
                    feeType="medium"
                    selected={selectedFee == "medium"}
                    onPress={handleSelectFee}
                />
                <FeeOption 
                    label={`Prioridade baixa - ${recomendedFee?.hourFee??0} sats/vb`} 
                    description="Taxa recomendada para confirmar a transação dentro de 1 hora (ou seja, dentro de aproximadamente 6 blocos)."
                    feeType="low"
                    selected={selectedFee == "low"}
                    onPress={handleSelectFee}
                />
                <FeeOption 
                    label={`Sem prioridade - ${recomendedFee?.minimumFee??0} sats/vb`} 
                    description="A menor taxa possível para que a transação não seja rejeitada pelos mineradores, mas sem garantia de tempo de confirmação."
                    feeType="minimun"
                    selected={selectedFee == "minimun"}
                    onPress={handleSelectFee}
                />
            </View>

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
