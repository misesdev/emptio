import { StyleProp, View, ViewStyle } from "react-native"

interface Props {
    visible: boolean,
    duration?: number,
    children: any,
    style?: StyleProp<ViewStyle>
}

export const Hidable = ({ children, visible = true, duration = 300, style }: Props) => {

    return (
        <View style={[style, { display: visible ? "flex" : "none" }]}>
            {children}
        </View>
    )
}

