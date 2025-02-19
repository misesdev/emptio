import { HeaderScreen } from "@components/general/HeaderScreen"
import { useTranslateService } from "@src/providers/translateProvider"
import { StackScreenProps } from "@react-navigation/stack"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import { FollowList } from "@components/nostr/follow/FollowList"
import theme from "@src/theme"

const ManageFriendsScreen = ({ navigation }: StackScreenProps<any>) => {

    const { useTranslate } = useTranslateService()

    return (
        <View style={theme.styles.container}>
            <HeaderScreen
                title={useTranslate("section.title.managefriends")}
                action={
                    <TouchableOpacity style={styles.addperson}>
                        <Ionicons name="person-add" size={16} color={theme.colors.white} />
                    </TouchableOpacity>
                }
                onClose={() => navigation.goBack()}
            />

            <FollowList 
                searchable 
                toFollow 
                searchTimout={0}
                onPressFollow={(follow) => {}}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    addperson: { padding: 10, borderRadius: 10 }
})

export default ManageFriendsScreen
