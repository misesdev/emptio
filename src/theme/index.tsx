import { StyleSheet } from "react-native";

const theme = {
    colors: {
        black: "#000000",
        white: "#BBB",
        red: "#C14D45",
        green: "#009751",
        blue: "#184149",
        gray: "#525B5F",
        default: "#2D3138",
        orange: "#bd6413",
        yellow: "#d4a91e",

        icons: "#FFFFFF",
        section: "#0c1e21",
        transparent: "transparent",
        link: "#0940e3",
        disabled: "#26292e"
    },
    icons: {
        mine: 18,
        medium: 22,
        large: 26,
        extra: 34,
        white: "#FFFFFF",
        gray: "525B5F",
        default: "#2D3138",
    },
    input: {
        color: "#1f2224",
        textColor: "#84898c",
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
            alignItems: "center"
        },
        hidden: {
            opacity: 0,
            height: 0,
            overflow: 'hidden',
        },
    })
};

export default theme;