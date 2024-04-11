import { SearchBox } from "@components/form/SearchBox"
import { HeaderScreen } from "@components/general/HeaderPage"
import { FollowList } from "@components/nostr/follow/FollowList"
import { useTranslate } from "@src/services/translate"
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native"
import theme from "@src/theme"
import { useEffect, useState } from "react"
import { User } from "@src/services/memory/types"
import { FollowItem } from "@components/nostr/follow/FollowItem"
import { listenerEvents } from "@src/services/nostr/events"
import { useAuth } from "@src/providers/userProvider"
import { nip19 } from "nostr-tools"

const AddFolowScreen = ({ navigation }: any) => {

    const { emptioData } = useAuth()
    const [follows, setFollows] = useState<User[]>()
    const [loading, setLoading] = useState(true)

    useEffect(() => { handleLoadInitialData() }, [])

    const handleLoadInitialData = async () => {

        var authors: string[] = []

        var developers = emptioData ? emptioData?.developers?.map(item => nip19.decode(item.pubkey).data.toString()) : []

        var securesellers = emptioData ? emptioData?.securesellers?.map(item => nip19.decode(item.pubkey).data.toString()) : []

        if (developers)
            authors = authors.concat(developers)

        if (securesellers)
            authors = authors.concat(securesellers)

        const events = await listenerEvents({ kinds: [0], limit: 10, authors })

        if (events)
            setFollows(events.slice(0, 10).map(event => event.content))

        setLoading(false)
    }

    const handleSearch = (searchTerm: string) => {
        console.log(searchTerm)
    }

    const handleAddFollow = (follow: User) => {
        console.log(follow.pubkey)
    }

    return (
        <View style={theme.styles.container}>

            <HeaderScreen title={useTranslate("screen.title.addfriend")} onClose={() => navigation.navigate("core-stack")} />

            <SearchBox label={`${useTranslate("commons.search")} npub..`} onSearch={handleSearch} />

            {loading && <ActivityIndicator color={theme.colors.gray} size={50} />}

            <ScrollView contentContainerStyle={{ flex: 1, alignItems: "center" }}>
                {
                    follows && follows.map((follow, key) => <FollowItem key={key} follow={follow} handleClickFollow={handleAddFollow} />)
                }
            </ScrollView>
            {/* <FollowList itemsPerPage={10} /> */}

        </View>
    )
}

const styles = StyleSheet.create({

})

export default AddFolowScreen