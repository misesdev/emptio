import { StyleSheet, View, Text } from "react-native"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { SearchBox } from "@components/form/SearchBox"
import { useTranslate } from "@src/services/translate"
import { useEffect } from "react"
import theme from "@src/theme"

const HomeSearchScreen = ({ navigation }: any) => {

    useEffect(() => {
        
    }, [])

    const handleSearch = (value: string) => {

    }

    return (
        <View style={theme.styles.container} >
            <HeaderScreen title="Search Home" onClose={() => navigation.navigate("core-stack")} />

            <SearchBox label={`${useTranslate("commons.search")} npub..`} onSearch={handleSearch} />

            <View style={{ flex: 1 }}>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    
})

export default HomeSearchScreen