import { useEffect, useState } from "react"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { useTranslateService } from "@src/providers/TranslateProvider"
import MnemonicWord from "../commons/MnemonicWord"
import { ButtonPrimary } from "@components/form/Buttons"
import theme from "@src/theme"

type Word = {
    word: string;
    position?: number;
    wrong: boolean;
}

const shuffleArray = (array: string[]) => {
    const arr = [...array]
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
}

const ConfirmMnemonicScreen = ({ navigation, route }: any) => {

    const { action, name, mnemonic } = route.params
    const [selectedWords, setSelectedWords] = useState<Word[]>([])
    const [error, setError] = useState<string | null>(null)
    const [disabled, setDisabled] = useState(true)
    const { useTranslate } = useTranslateService()

    useEffect(() => {
        if (mnemonic) {
            const selectedWords = shuffleArray(mnemonic).map(word => ({ word, wrong: false }))
            setSelectedWords(selectedWords)
        }
    }, [mnemonic])

    const onSelectWord = (item: Word) => {
        setSelectedWords(prev => prev.map(x => {
            if(x.word == item.word && !x.position && !error)
                x.position = (prev.filter(i => !!i.position).length + 1)
            else if(x.wrong && x.word == item.word && !!x.position) 
                x.position = undefined
            x.wrong = (!!x.position && x.word != mnemonic[(x.position??-1)-1])
            return x
        }))
        setTimeout(() => {
            const markeds = selectedWords.filter(item => !!item.position)
            if(markeds.some(item => item.word != mnemonic[(item.position??-1)-1])) 
            {
                setError("A ordem das palavras está incorreta");
            } else {
                setError(null)
                if(markeds.length == mnemonic.length) {
                    setDisabled(false)
                }
            }
        }, 20)
    }

    const continueToPassPhrase = () => {
        navigation.navigate("wallet-passphrase", {
            action, name, mnemonic: mnemonic.join(" ")
        })
    }

    return (
        <ScrollView contentContainerStyle={theme.styles.scroll_container}>

            <View style={styles.content}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Confirme sua frase secreta</Text>
                </View>

                <View style={styles.descriptionContainer}>
                    <Text style={styles.description}>
                        Toque nas palavras na ordem correta para confirmar que você anotou sua
                        frase de recuperação.
                    </Text>
                </View>

                <View style={styles.wordList}>
                    <View style={{ width: "50%", padding: 8 }}>
                        {selectedWords.slice(0,6).map(item => {
                            const backgroundColor = item.wrong ? theme.colors.red : theme.colors.white
                            return <MnemonicWord
                                key={item.word}
                                word={item.word}
                                position={item.position}
                                onPress={() => onSelectWord(item)}
                                backgroundColor={backgroundColor}
                            />
                        })}
                    </View>
                    <View style={{ width: "50%", padding: 8 }}>
                        {selectedWords.slice(6,12).map(item => {
                            const backgroundColor = item.wrong ? theme.colors.red : theme.colors.white
                            return <MnemonicWord
                                key={item.word}
                                word={item.word}
                                position={item.position}
                                onPress={() => onSelectWord(item)}
                                backgroundColor={backgroundColor}
                            />
                        })}
                    </View>
                </View>
            </View>
                    
            {error && <Text style={styles.errorMessage}>{error}</Text>}

            <View style={styles.buttonArea}>
                <ButtonPrimary
                    disabled={disabled}
                    label={useTranslate("commons.continue")}
                    onPress={continueToPassPhrase}
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    content: { width: "100%", paddingVertical: 50 },
    titleContainer: { padding: 10, marginVertical: 10 },
    title: { fontSize: 32, fontWeight: "bold", textAlign: "center", color: theme.colors.white },
    descriptionContainer: { padding: 20 },
    description: { fontSize: 14, color: theme.colors.gray, textAlign: "center" },
    errorMessage: { color: theme.colors.red, fontSize: 14, marginTop: 5, textAlign: "center" },
    selectedArea: { flexDirection: "row", flexWrap: "wrap", padding: 10, minHeight: 80,
        backgroundColor: theme.colors.matteBlack, borderRadius: theme.design.borderRadius, 
        marginVertical: 15 },
    wordList: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", padding: 10 },
    buttonArea: { width: '100%', position: "absolute", bottom: 0, marginVertical: 20, 
        paddingHorizontal: 30 },
})

export default ConfirmMnemonicScreen
