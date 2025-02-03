import { StyleSheet, TouchableOpacity, Text } from "react-native"
import theme from "@/src/theme"

type ScreenProps = {
    hashtag?: string
}
const HashTagViewer = ({ hashtag }: ScreenProps) => {
    
    // return (
    //     <TouchableOpacity>
    //         <Text style={styles.profile}>{hashtag}</Text>
    //     </TouchableOpacity>
    // )
    return <Text style={styles.profile}>{hashtag}</Text>
}

const styles = StyleSheet.create({
    profile: { color: theme.colors.blue }
})

export default HashTagViewer
