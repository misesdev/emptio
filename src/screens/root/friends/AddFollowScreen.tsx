import { SearchBox } from "@components/form/SearchBox"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { UserList } from "@components/nostr/user/UserList"
import { User } from "@services/user/types/User"
import { useTranslateService } from "@src/providers/TranslateProvider"
import FollowModal, { showFollowModal } from "@components/nostr/follow/FollowModal"
import { StackScreenProps } from "@react-navigation/stack"
import { useAddFriend } from "./hooks/useAddFriend"
import { View } from "react-native"
import theme from "@src/theme"

const AddFolowScreen = ({ navigation }: StackScreenProps<any>) => {

    const { useTranslate } = useTranslateService()
    const { users, loading, addUser, search } = useAddFriend()

    const handleAddFollow = async (follow: User) => {
        showFollowModal({ user: follow })
    }

    return (
        <View style={theme.styles.container}>

            <HeaderScreen 
                title={useTranslate("screen.title.addfriend")} 
                onClose={() => navigation.goBack()} 
            />

            <SearchBox loading={loading} 
                seachOnLenth={1} delayTime={300}
                label={useTranslate("commons.search")} 
                onSearch={search} 
            />

            <UserList 
                users={users} 
                showButton
                labelAction={useTranslate("commons.details")}
                onPressUser={handleAddFollow} 
            />

            <View style={{ height: 38 }}></View>

            <FollowModal handleAddFollow={addUser} />
        </View>
    )
}

export default AddFolowScreen



