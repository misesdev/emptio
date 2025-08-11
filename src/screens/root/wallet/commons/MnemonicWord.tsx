import theme from "@/src/theme";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

type MnemonicWordProps = {
    word: string;
    position?: number;
    onPress?: (w: string) => void;
    backgroundColor?: string;
}

const MnemonicWord = ({ position, word, onPress, backgroundColor=theme.colors.white }: MnemonicWordProps) => {
   
    const onPressWord = () => onPress && onPress(word)
    return (
        <TouchableOpacity activeOpacity={.7}
            onPress={onPressWord}
            style={[styles.wordContainer, { backgroundColor }]}
        >
            <View style={{ width: "15%" }}>
                <View style={styles.positionContainer}>
                    {position && <Text style={styles.position}>{position}</Text>}
                </View>
            </View>
            <View style={{ width: "85%" }}>
                <Text style={styles.word}>{word}</Text>
            </View>
        </TouchableOpacity> 
    )
}

const styles = StyleSheet.create({
    wordContainer: { borderRadius: theme.design.borderRadius, padding: 6, flexDirection: "row", margin: 5 },
    positionContainer: { width: 30, height: 30, padding: 4, backgroundColor: theme.colors.matteBlack,
        borderRadius: theme.design.borderRadius },
    position: { width: "100%", textAlign: "center", fontSize: 16, fontWeight: "bold", 
        color: theme.colors.white },
    word: { width: "100%", color: theme.colors.matteBlack, fontSize: 16, fontWeight: "bold", 
        textAlign: "center" }
})

export default MnemonicWord
