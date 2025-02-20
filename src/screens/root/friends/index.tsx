import { HeaderScreen } from "@components/general/HeaderScreen"
import { useTranslateService } from "@src/providers/translateProvider"
import { StackScreenProps } from "@react-navigation/stack"
import { StyleSheet, TouchableOpacity, FlatList, View } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import { useAuth } from "@src/providers/userProvider"
import { User } from "@services/memory/types"
import { memo, useCallback, useState } from "react"
import { FollowItem } from "@components/nostr/follow/FollowItem"
import { SearchBox } from "@components/form/SearchBox"
import { walletService } from "@src/core/walletManager"
import { getUserName } from "@src/utils"
import theme from "@src/theme"
import { userService } from "@/src/core/userManager"

const ManageFriendsScreen = ({ navigation }: StackScreenProps<any>) => {

    const { useTranslate } = useTranslateService()
    const { user, follows, setFollows, followsEvent } = useAuth()
    const [friends, setFriends] = useState<User[]>(follows)
  
    const handleSearch = (filter: string) => {
        if (filter?.length && !walletService.address.validate(filter)) {
            const searchResult = follows?.filter(follow => {
                let filterNameLower = getUserName(follow, 30).toLowerCase()
                return filterNameLower.includes(filter.toLowerCase())
            })

            setFriends(searchResult ?? [])
        }
        else setFriends(follows??[])
    }

    const handleRemoveFriend = async (follow: User) => {
      
        setFriends(prev => {
            return [...prev.filter(f => f.pubkey != follow.pubkey)]
        })

        if(setFollows && follows) 
            setFollows([...follows.filter(f => f.pubkey != follow.pubkey)])

        followsEvent!.tags = followsEvent?.tags?.filter(t => t[0] == "p" && t[1] != follow.pubkey) ?? []
    
        await userService.updateFollows({ user, follows: followsEvent })
    }

    const ListItem = memo(({ item }: { item: User }) => (
        <FollowItem isFriend follow={item} toManage handleClickFollow={handleRemoveFriend} />
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
                onSearch={handleSearch}
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
    addperson: { padding: 10, borderRadius: 10 }
})

export default ManageFriendsScreen
