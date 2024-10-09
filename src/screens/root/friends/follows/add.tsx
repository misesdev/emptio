import { SearchBox } from "@components/form/SearchBox"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { ActivityIndicator, View } from "react-native"
import { User } from "@src/services/memory/types"
import { useAuth } from "@src/providers/userProvider"
import { useTranslateService } from "@/src/providers/translateProvider"
import { userService } from "@/src/core/userManager"
import { UserList } from "@/src/components/nostr/user/UserList"
import theme from "@src/theme"
import { useState } from "react"


const AddFolowScreen = ({ navigation }: any) => {

    const { user } = useAuth()
    const { useTranslate } = useTranslateService()
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(false)

    const handleSearch = async (searchTerm: string) => {

        if(searchTerm?.length <= 1) {
            setUsers([])
            return;
        }
            
        setLoading(true)

        const users = await userService.searchUsers(user, searchTerm)

        users.sort((a, b) => (b.similarity ?? 1) - (a.similarity ?? 1))

        setUsers(users)

        setLoading(false)
    }

    const handleAddFollow = (follow: User) => {
        console.log(follow.pubkey)
    }

    return (
        <View style={theme.styles.container}>

            <HeaderScreen title={useTranslate("screen.title.addfriend")} onClose={() => navigation.navigate("core-stack")} />

            <SearchBox label={useTranslate("commons.search")} onSearch={handleSearch} />

            {loading && <ActivityIndicator color={theme.colors.gray} size={50} />}

            <UserList users={users} onPressUser={handleAddFollow} />

        </View>
    )
}

export default AddFolowScreen



