import { StyleSheet, View, Text } from "react-native"
import { SearchBox } from "@components/form/SearchBox"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { useTranslateService } from "@src/providers/translateProvider"
import { StackScreenProps } from "@react-navigation/stack"
import { useEffect } from "react"
import theme from "@src/theme"

const FeedSearchScreen = ({ navigation }: StackScreenProps<any>) => {

    const { useTranslate } = useTranslateService()
    
    useEffect(() => {

    }, [])

    const handleSearch = (value: string) => {

    }

    return (
        <View style={theme.styles.container} >
            <HeaderScreen title="Search Feed" onClose={() => navigation.goBack()} />

            <SearchBox seachOnLenth={1} 
                label={`${useTranslate("commons.search")} npub..`} 
                onSearch={handleSearch} 
            />

            <View style={{ flex: 1 }}>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({

})

export default FeedSearchScreen
