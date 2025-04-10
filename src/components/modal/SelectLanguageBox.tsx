import { useState } from "react"
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useTranslateService } from "@src/providers/translateProvider"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Language } from "@services/translate/types"
import theme from "@src/theme"
import { storageService } from "@services/memory"

var showLanguagesFunction: () => void

type Props = {
    forceUpdate: (number: any) => void
}

const SelectLanguageBox = ({ forceUpdate }: Props) => {

    const { useTranslate, setLanguage, language } = useTranslateService()
    const [visible, setVisible] = useState(false)
    const [languagesList, setLanguageList] = useState<Language[]>()

    showLanguagesFunction = () => {
        setLanguageList(storageService.language.list())
        setVisible(true)
    }

    const changeLanguage = (language: Language) => {
        if (setLanguage)
            setLanguage(language)
        setVisible(false)
        storageService.language.add(language)
        forceUpdate(Math.random())
    }

    const renderLanguageOption = (item: Language, key: number) => {

        var selected = item.selector == language?.selector

        return (
            <TouchableOpacity key={key} onPress={() => changeLanguage(item)} style={[styles.option]} >
                <View style={{ width: "80%", height: "100%", alignItems: "center" }}>
                    <Text style={styles.labelOption}>{useTranslate(item.selector)}</Text>
                </View>
                <View style={{ width: "20%", height: "100%", flexDirection: "row-reverse", alignItems: "center" }}>
                    {selected && <Ionicons name="checkmark-circle" size={18} color={theme.colors.green} />}
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <Modal animationType="fade" onRequestClose={() => setVisible(false)} visible={visible} transparent >
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0, .6)" }}>
                <View style={styles.box}>
                    {languagesList &&
                        languagesList.map((item, key) => renderLanguageOption(item, key))
                    }
                </View>
            </View>
        </Modal>
    )
}

export const showSelectLanguage = () => {
    setTimeout(() => { showLanguagesFunction() }, 10)
}

const styles = StyleSheet.create({
    box: { padding: 10, width: "85%", borderRadius: 8, backgroundColor: theme.colors.section },
    option: { width: "100%", flexDirection: "row", padding: 5, borderRadius: 10, marginVertical: 2 },
    labelOption: { width: "100%", color: theme.colors.white, padding: 10 },
    absolute: { position: "absolute", width: "100%", height: "100%", top: 0, left: 0, bottom: 0, right: 0 }
})

export default SelectLanguageBox
