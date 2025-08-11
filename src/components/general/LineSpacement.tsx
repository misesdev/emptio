import { StyleSheet, View } from "react-native"

export type Props = {
    height?: number
}

const LineSpacement = ({ height=10 }: Props) => (
    <View style={[styles.space, { height: height }]}>
    </View>
)

const styles = StyleSheet.create({
    space: { width: "100%" }
})

export default LineSpacement
