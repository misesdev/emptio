import { StyleSheet, Text } from "react-native"
import theme from "@src/theme"

interface ScreenProps {
    hashtag?: string,
    onPress?: (hashtag: string) => void
}

const HashTagViewer = ({ hashtag, onPress }: ScreenProps) => {
    
    const handlePress = () => onPress && hashtag && onPress(hashtag)

    return <Text onPress={handlePress} style={styles.hashtag}>{hashtag}</Text>
}

const styles = StyleSheet.create({
    hashtag: { color: theme.colors.white, fontWeight: "500", textDecorationLine: "none" }
})

export default HashTagViewer
