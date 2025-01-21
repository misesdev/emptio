import theme from "@src/theme"
import { useRef, useState } from "react"
import { Ionicons } from "@expo/vector-icons"
import { StyleSheet, TextInput, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"

type SearchBoxProps = {
    label: string,
    textCenter?: boolean,
    delayTime?: number,
    seachOnLenth: number,
    onSearch: (value: string) => void
}

export const SearchBox = ({ label, textCenter, delayTime = 500, seachOnLenth = 1, onSearch }: SearchBoxProps) => {
    
    let TimeOutSearch: any = useRef(null)

    const [search, setSearch] = useState<string>()

    const handleSearch = (value: string) => {
        setSearch(value)
        if (value.trim().length >= seachOnLenth) {
            if(TimeOutSearch.current) clearTimeout(TimeOutSearch.current)
            TimeOutSearch.current = setTimeout(() => onSearch(value), delayTime)
        }
    }

    return (
        <View style={styles.control}>
            <View style={[styles.container, { flexDirection: "row" }]}>
                <View style={styles.searchIcon}>
                    <Ionicons name="search" size={theme.icons.large} color={theme.colors.gray} />
                </View>
                <TextInput style={[styles.input, { textAlign: textCenter ? "center" : "auto", width: "72%" }]}
                    placeholder={label}
                    onChangeText={handleSearch}
                    //clearTextOnFocus={true}
                    placeholderTextColor={theme.colors.gray}
                    value={search}
                />
                {search &&
                    <View style={styles.searchButton}>
                        <TouchableOpacity activeOpacity={.7} onPress={() => setSearch("")}>
                            <Ionicons name="close" size={theme.icons.large} color={theme.colors.gray} />
                        </TouchableOpacity>
                    </View>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    control: { width: "100%", alignItems: "center", paddingVertical: 5 },
    container: { width: "94%", color: theme.colors.white, backgroundColor: theme.input.backGround, borderRadius: 24, margin: 5 },
    input: { paddingVertical: 15, paddingHorizontal: 10, color: theme.input.textColor },
    searchIcon: { width: "14%", justifyContent: "center", alignItems: "center" },
    searchButton: { width: "14%", justifyContent: "center", alignItems: "center" }
})
