import { SearchBox } from "@components/form/SearchBox"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { FollowList } from "@components/nostr/follow/FollowList"
import { StyleSheet, View } from "react-native"
import theme from "@src/theme"
import { useState } from "react"
import { User } from "@src/services/memory/types"
import { useTranslateService } from "@/src/providers/translateProvider"
import { useAuth } from "@/src/providers/userProvider"
import { UserChat } from "../list"

const NewChatScreen = ({ navigation }: any) => {

    const { user } = useAuth()
    const { useTranslate } = useTranslateService()
    const [searchTerm, setSearchTerm] = useState("")

    const handleChatFollow = (follow: User) => {
        var chat_id: string = ""
        chat_id = (user?.pubkey?.substring(0, 30) ?? "")+(follow?.pubkey?.substring(0, 30) ??"")
        chat_id = chat_id.split("").sort().join("")

        const userChat: UserChat = { user: follow, lastMessage: { chat_id } }

        navigation.navigate("conversation-chat-stack", { userChat: userChat })
    }

    return (
        <View style={theme.styles.container}>

            <HeaderScreen title={useTranslate("screen.title.newchat")} onClose={() => navigation.navigate("core-stack")} />

            <SearchBox seachOnLenth={0} delayTime={100} label={`${useTranslate("commons.search")} npub..`} onSearch={(searchTerm) => setSearchTerm(searchTerm)} />

            <FollowList searchable searchTerm={searchTerm} iNot onPressFollow={handleChatFollow} />

        </View>
    )
}

const styles = StyleSheet.create({

})

export default NewChatScreen
