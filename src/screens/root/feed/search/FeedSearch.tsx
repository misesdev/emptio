import { StyleSheet, View, Text } from "react-native"
import { SearchBox } from "@components/form/SearchBox"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { useEffect } from "react"
import theme from "@src/theme"
import { useTranslateService } from "@/src/providers/translateProvider"

const FeedSearchScreen = ({ navigation }: any) => {

    const { useTranslate } = useTranslateService()
    
    useEffect(() => {

    }, [])

    const handleSearch = (value: string) => {

    }

    return (
        <View style={theme.styles.container} >
            <HeaderScreen title="Search Feed" onClose={() => navigation.navigate("core-stack")} />

            <SearchBox label={`${useTranslate("commons.search")} npub..`} onSearch={handleSearch} />

            <View style={{ flex: 1 }}>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({

})

export default FeedSearchScreen
