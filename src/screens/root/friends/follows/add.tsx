import { SearchBox } from "@components/form/SearchBox"
import { HeaderPage } from "@components/general/HeaderPage"
import { FollowList } from "@components/nostr/follow/FollowList"
import { useTranslate } from "@src/services/translate"
import { StyleSheet, View } from "react-native"
import theme from "@src/theme"

const AddFolowScreen = ({ navigation }: any) => {

    const handleSearch = (searchTerm: string) => {
        console.log(searchTerm)
    }

    return (
        <View style={theme.styles.container}>
            
            <HeaderPage title="Add Friend" onClose={() => navigation.navigate("core-stack")} />

            <SearchBox label={`${useTranslate("commons.search")} npub..`} onSearch={handleSearch} />

            <View style={{ flex: 1 }}>

            </View>
            {/* <FollowList itemsPerPage={10} /> */}

        </View>
    )
}

const styles = StyleSheet.create({

})

export default AddFolowScreen