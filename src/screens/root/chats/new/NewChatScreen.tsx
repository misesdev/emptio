import { HeaderScreen } from "@components/general/HeaderScreen"
import { FollowList } from "@components/nostr/follow/FollowList"
import { StackScreenProps } from "@react-navigation/stack"
import { useAccount } from "@src/context/AccountContext"
import { useTranslateService } from "@src/providers/TranslateProvider"
import { User } from "@services/user/types/User"
import { ChatUtilities } from "@src/utils/ChatUtilities"
import { View } from "react-native"
import theme from "@src/theme"

const NewChatScreen = ({ navigation }: StackScreenProps<any>) => {

    const { user } = useAccount()
    const { useTranslate } = useTranslateService()

    const handleChatFollow = (follow: User) => {
        const chat_id = ChatUtilities.chatIdFromPubkeys([user.pubkey, follow.pubkey])
        navigation.replace("conversation", { follow, chat_id })
    }

    return (
        <View style={theme.styles.container}>
            <HeaderScreen 
                title={useTranslate("screen.title.newchat")}
                onClose={() => navigation.goBack()} 
            />

            <FollowList 
                searchable 
                searchTimout={200} 
                onPressFollow={handleChatFollow} 
                labelAction={useTranslate("commons.talk")}
            />
        </View>
    )
}

export default NewChatScreen
