import { StyleSheet } from "react-native";

const theme = {
    colors: {
        black: "#000000",
        matteBlack: "#040404",
        white: "#DDD",
        red: "#C14D45",
        green: "#0b612f",
        blue: "#184149",
        blueOpacity: "rgba(0, 55, 55, .4)",
        gray: "#828B8F",
        default: "#2D3138",
        orange: "#d95716",
        yellow: "#d4a91e",

        icons: "#FFFFFF",
        section: "#0c1e21",
        chat_received: "#0c1e21",
        chat_sended: "#033333",
        transparent: "transparent",
        semitransparent: "rgba(0,0,0,.6)",
        semitransparentdark: "rgba(0,0,0,.9)",
        link: "#0940e3",
        disabled: "#26292e"
    },
    icons: {
        mine: 18,
        medium: 22,
        large: 26,
        extra: 34,
        white: "#FFFFFF",
        gray: "#525B5F",
        default: "#2D3138",
    },
    input: {
        color: "#1f2224",
        textColor: "#84898c",
        placeholderColor: "#525B5F",
        backGround: "#0e191f",
    },
    styles: StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: "#000000"
        },
        scroll_container: {
            flexGrow: 1,
            alignContent: "center",
            alignItems: "center",
            backgroundColor: "transparent"
        },
        hidden: {
            opacity: 0,
            height: 0,
            overflow: 'hidden',
        },
        row: {
            width: "100%",
            flexDirection: "row"
        }
    }),
    design: {
        borderRadius: 15
    }
};

export default theme;
