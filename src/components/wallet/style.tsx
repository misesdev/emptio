import theme from "@src/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    headerWallet: {
        top: 0,
        height: 240,
        width: "100%",
        position: "absolute",
        backgroundColor: "rgba(0, 55, 55, .7)"
    },
    headerText: {
        fontWeight: "bold",
        marginVertical: 5,
        marginHorizontal: 24,
        color: theme.colors.white
    },
    headerWalletTitle: {

    },
    sectionTransactions: {
        padding: 10,
        width: "100%",
        borderRadius: theme.design.borderRadius,
    },
    sectionTransaction: {
        width: "100%",
        minHeight: 75,
        maxHeight: 120,
        borderRadius: theme.design.borderRadius,
        marginVertical: 4,
        flexDirection: "row",
        backgroundColor: "rgba(0, 55, 55, .2)"
    },
    walletButtonsSection: {
        width: "100%",
        position: "absolute",
        bottom: 45,
        flexDirection: "row",
        justifyContent: "center",
    },
    walletActionButton: {
        minWidth: 130,
        paddingVertical: 8,
        paddingHorizontal: 10,
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: "rgba(60,60,60, .8)"
    },
    walletaAtionText: {
        margin: 6,
        color: theme.colors.white,
        textAlign: "center",
        fontWeight: "600"
    }
})
