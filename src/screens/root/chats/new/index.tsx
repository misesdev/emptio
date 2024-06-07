import { SearchBox } from "@components/form/SearchBox"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { FollowList } from "@components/nostr/follow/FollowList"
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native"
import theme from "@src/theme"
import { useEffect, useState } from "react"
import { User } from "@src/services/memory/types"
import { FollowItem } from "@components/nostr/follow/FollowItem"
import { listenerEvents } from "@src/services/nostr/events"
import { useAuth } from "@src/providers/userProvider"
import { nip19 } from "nostr-tools"
import { useTranslateService } from "@/src/providers/translateProvider"

const NewChatScreen = ({ navigation }: any) => {

    const { useTranslate } = useTranslateService()
    const [follows, setFollows] = useState<User[]>()
    const [loading, setLoading] = useState(true)

    const handleSearch = (searchTerm: string) => {
        console.log(searchTerm)
    }

    const handleChatFollow = (follow: User) => {
        console.log(follow.pubkey)
    }

    return (
        <View style={theme.styles.container}>

            <HeaderScreen title={useTranslate("screen.title.newchat")} onClose={() => navigation.navigate("core-stack")} />

            <SearchBox label={`${useTranslate("commons.search")} npub..`} onSearch={handleSearch} />

            <FollowList itemsPerPage={20} onPressFollow={handleChatFollow} />

        </View>
    )
}

const styles = StyleSheet.create({

})

export default NewChatScreen