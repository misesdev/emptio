import { SearchBox } from "@components/form/SearchBox"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { FollowList } from "@components/nostr/follow/FollowList"
import { StyleSheet, View } from "react-native"
import { User } from "@services/memory/types"
import { useTranslateService } from "@/src/providers/translateProvider"
import { useAuth } from "@src/providers/userProvider"
import { StackScreenProps } from "@react-navigation/stack"
import { useState } from "react"
import theme from "@src/theme"

const NewChatScreen = ({ navigation }: StackScreenProps<any>) => {

    const { user } = useAuth()
    const { useTranslate } = useTranslateService()
    const [searchTerm, setSearchTerm] = useState("")

    const handleChatFollow = (follow: User) => {
        var chat_id: string = ""
        chat_id = (user?.pubkey?.substring(0, 30) ?? "")+(follow?.pubkey?.substring(0, 30) ??"")
        chat_id = chat_id.match(/.{1,2}/g)?.sort().join("") ?? ""

        navigation.navigate("conversation-chat-stack", { follow, chat_id })
    }

    return (
        <View style={theme.styles.container}>

            <HeaderScreen title={useTranslate("screen.title.newchat")} onClose={() => navigation.goBack()} />

            <SearchBox seachOnLenth={0} delayTime={100} label={useTranslate("commons.search")} onSearch={(searchTerm) => setSearchTerm(searchTerm)} />

            <FollowList searchable searchTimout={200} searchTerm={searchTerm} iNot onPressFollow={handleChatFollow} />

        </View>
    )
}

const styles = StyleSheet.create({

})

export default NewChatScreen
