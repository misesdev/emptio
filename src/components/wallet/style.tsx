import theme from "@src/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    // Wallet List Item
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
    },

    // Wallet Scren
    headerWallet: {
        top: 0,
        height: 240,
        width: "100%",
        position: "absolute",
        backgroundColor: "rgba(0, 55, 55, .7)"
    },
    headerWalletSub: {
        width: "100%",
        flexDirection: "row-reverse",
        padding: 20,
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
        borderRadius: 25,
    },
    sectionTransaction: {
        width: "100%",
        minHeight: 75,
        maxHeight: 120,
        borderRadius: 23,
        marginVertical: 4,
        flexDirection: "row",
        backgroundColor: "rgba(0, 55, 55, .2)"//theme.colors.section
    },
    walletButtonsSection: {
        width: "100%",
        position: "absolute",
        bottom: 25,
        flexDirection: "row",
        justifyContent: "center",
    },
    walletActionButton: {
        minWidth: 130,
        paddingVertical: 8,
        paddingHorizontal: 10,
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: "rgba(60,60,60, .8)"// theme.colors.gray
    },
    walletaAtionText: {
        margin: 6,
        color: theme.colors.white,
        textAlign: "center",
        fontWeight: "600"
    }

})