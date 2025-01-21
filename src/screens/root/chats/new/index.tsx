import { SearchBox } from "@components/form/SearchBox"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { FollowList } from "@components/nostr/follow/FollowList"
import { StyleSheet, View } from "react-native"
import theme from "@src/theme"
import { useState } from "react"
import { User } from "@src/services/memory/types"
import { useTranslateService } from "@/src/providers/translateProvider"

const NewChatScreen = ({ navigation }: any) => {

    const { useTranslate } = useTranslateService()
    const [searchTerm, setSearchTerm] = useState("")

    const handleChatFollow = (follow: User) => {
        console.log(follow)
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
