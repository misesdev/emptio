import { Wallet } from "@src/services/memory/types";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import theme from "@/src/theme";
import { ButtonDanger, ButtonSuccess } from "../form/Buttons";
import { useTranslate } from "@/src/services/translate";

type Props = {
    wallets?: Wallet[]
}

export const WalletList = ({ wallets }: Props) => {
    return (
        <View style={styles.section}>
            {
                wallets && wallets.map((wallet, key) => {
                    return (
                        <TouchableOpacity style={[styles.wallet, { backgroundColor: "#eb8f34" }]} key={key}>
                            <Text style={styles.title}>{useTranslate("labels.wallet.add")}</Text>
                            <Text style={styles.description}>{useTranslate("message.wallet.create")}</Text>
                            <TouchableOpacity style={styles.button} onPress={() => { }}>
                                <Text style={styles.buttonText}> {useTranslate("commons.add")} </Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    )
                })
            }

            <View style={[styles.wallet, { backgroundColor: theme.colors.section }]}>
                <Text style={styles.title}>{useTranslate("labels.wallet.add")}</Text>
                <Text style={styles.description}>{useTranslate("message.wallet.create")}</Text>
                <TouchableOpacity style={styles.button} onPress={() => { }}>
                    <Text style={styles.buttonText}> {useTranslate("commons.add")} </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    section: {
        width: "100%",
        padding: 10
    },
    wallet: {
        marginVertical: 8,
        marginHorizontal: 4,
        borderRadius: 18,
        padding: 5,
    },
    title: {
        color: theme.colors.white,
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 20,
        marginHorizontal: 10
    },
    description: {
        color: theme.colors.gray,
        marginHorizontal: 10,
        marginVertical: 6
    },
    button: {
        margin: 10,
        maxWidth: 150,
        paddingVertical: 14,
        borderRadius: 15,
        backgroundColor: theme.colors.blue
    },
    buttonText: {
        color: theme.colors.white,
        fontSize: 13,
        fontWeight: "bold",
        textAlign: 'center',
        marginHorizontal: 28
    }
})