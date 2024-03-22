import { StyleSheet } from "react-native";

const theme = {
    colors: {
        black: "#000000",
        white: "#FFFFFF",
        red: "#C14D45",
        green: "#009751",
        blue: "#184149",
        gray: "#525B5F",
        default: "#2D3138",

        icons: "#FFFFFF",
        menu: "rgba(28,28,28,.9)",
        transparent: "transparent"
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
    styles: StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: "#000000"
        }
    }) 
};

export default theme;