import { HeaderScreen } from "@components/general/HeaderScreen"
import { StackScreenProps } from "@react-navigation/stack"
import { StyleSheet, TouchableOpacity, FlatList, View } from "react-native"
import { useTranslateService } from "@src/providers/TranslateProvider"
import Ionicons from "react-native-vector-icons/Ionicons"
import { memo, useCallback } from "react"
import { FollowItem } from "@components/nostr/follow/FollowItem"
import { SearchBox } from "@components/form/SearchBox"
import { User } from "@services/user/types/User"
import { useFriends } from "./hooks/useFriends"
import theme from "@src/theme"

const ManageFriendsScreen = ({ navigation }: StackScreenProps<any>) => {

    const { useTranslate } = useTranslateService()
    const { friends, search, remove } = useFriends()
  
    const ListItem = memo(({ item }: { item: User }) => (
        <FollowItem 
            isFriend 
            follow={item} 
            handleClickFollow={remove} 
            labelAction={useTranslate("commons.remove")}
        />
    ))

    const renderItem = useCallback(({ item }: { item: User }) => {
        return <ListItem item={item} />
    }, [])

    return (
        <View style={theme.styles.container}>
            <HeaderScreen
                title={useTranslate("section.title.managefriends")}
                action={
                    <TouchableOpacity style={styles.addperson}
                        onPress={() => navigation.navigate("add-follow-stack")}
                    >
                        <Ionicons name="person-add" size={20} color={theme.colors.white} />
                    </TouchableOpacity>
                }
                onClose={() => navigation.goBack()}
            />
            
            <SearchBox delayTime={200} seachOnLenth={0}
                label={useTranslate("commons.search")} 
                onSearch={search}
            />  

            <FlatList 
                data={friends}
                renderItem={renderItem}
                contentContainerStyle={[theme.styles.scroll_container, { paddingBottom: 30 }]}
                keyExtractor={item => item.pubkey ?? Math.random().toString()}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    addperson: { padding: 10, paddingVertical: 5, borderRadius: 10 }
})

export default ManageFriendsScreen
