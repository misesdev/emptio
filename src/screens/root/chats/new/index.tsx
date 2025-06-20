import { HeaderScreen } from "@components/general/HeaderScreen"
import { FollowList } from "@components/nostr/follow/FollowList"
import { View } from "react-native"
import { User } from "@services/memory/types"
import { useTranslateService } from "@src/providers/translateProvider"
import { useAuth } from "@src/providers/userProvider"
import { StackScreenProps } from "@react-navigation/stack"
import { messageService } from "@services/message"
import theme from "@src/theme"

const NewChatScreen = ({ navigation }: StackScreenProps<any>) => {

    const { user } = useAuth()
    const { useTranslate } = useTranslateService()

    const handleChatFollow = (follow: User) => {
        var chat_id: string = messageService.generateChatId(undefined, [user.pubkey??"", follow.pubkey??""])
        navigation.navigate("conversation-chat-stack", { follow, chat_id })
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
