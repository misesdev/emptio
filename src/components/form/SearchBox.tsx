import theme from "@src/theme"
import { useRef, useState } from "react"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { StyleSheet, TextInput, View, TouchableOpacity } from "react-native"
import { ActivityIndicator } from "react-native-paper"

interface SearchBoxProps {
    label: string,
    loading?: boolean,
    textCenter?: boolean,
    delayTime?: number,
    seachOnLenth: number,
    onSearch: (value: string) => void
}

export const SearchBox = ({ label, loading, textCenter, delayTime = 500, seachOnLenth = 1, onSearch }: SearchBoxProps) => {
    
    let TimeOutSearch: any = useRef(null)

    const [search, setSearch] = useState<string>("")

    const handleSearch = (value: string) => {
        setSearch(value)
        if (value.trim().length >= seachOnLenth) {
            if(TimeOutSearch.current) clearTimeout(TimeOutSearch.current)
            TimeOutSearch.current = setTimeout(() => onSearch(value), delayTime)
        }
    }

    const handleClear = () => handleSearch("")

    return (
        <View style={styles.control}>
            <View style={[styles.container, { flexDirection: "row" }]}>
                <View style={styles.searchIcon}>
                    <Ionicons name="search" size={theme.icons.large} color={theme.colors.gray} />
                </View>
                <TextInput style={[styles.input, { textAlign: textCenter ? "center" : "auto", width: "76%" }]}
                    placeholder={label}
                    onChangeText={handleSearch}
                    //clearTextOnFocus={true}
                    placeholderTextColor={theme.colors.gray}
                    value={search}
                />
                <View style={styles.searchButton}>
                    {search && !loading &&
                        <TouchableOpacity activeOpacity={.7} onPress={handleClear}>
                            <Ionicons name="close" size={theme.icons.large} color={theme.colors.gray} />
                        </TouchableOpacity>
                    }
                    {loading && 
                        <ActivityIndicator size={15} color={theme.colors.gray}/>
                    }
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    control: { width: "100%", alignItems: "center", paddingVertical: 5 },
    container: { width: "94%", color: theme.colors.white, backgroundColor: theme.input.backGround,
        borderRadius: 10, margin: 5 },
    input: { paddingVertical: 15, paddingHorizontal: 10, color: theme.input.textColor },
    searchIcon: { width: "12%", justifyContent: "center", alignItems: "center" },
    searchButton: { width: "12%", justifyContent: "center", alignItems: "center" }
})
