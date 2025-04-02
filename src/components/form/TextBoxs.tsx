import { StyleSheet, TextInput, TouchableOpacity, View, Keyboard } from "react-native"
import QRCodeReaderModal from "@components/modal/QRCodeReaderModal"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useEffect, useRef, useState } from "react"
import theme from "@src/theme"

type TextBoxProps = {
    value?: string | ""
    placeholder?: string,
    onChangeText: (text: string) => void,
    onFocus?: () => void,
    onBlur?: () => void,
    center?: boolean
}

export const TextBox = ({ value, placeholder, onChangeText, onFocus, onBlur, center }: TextBoxProps) => {

    const textInputRef = useRef<TextInput>(null)

    useEffect(() => {
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            if (textInputRef.current) {
                textInputRef.current.blur();
            }
        })
        return () => {
            keyboardDidHideListener.remove();
        };
    }, [])

    return (
        <View style={styles.container}>
            <TextInput style={[styles.input, { textAlign: center ? "center" : "auto" }]} ref={textInputRef}
                placeholder={placeholder}
                onFocus={onFocus}
                onBlur={onBlur}
                onChangeText={onChangeText}
                clearTextOnFocus={true}
                placeholderTextColor={theme.colors.gray}
                value={value}
            />
        </View>
    )
}

export const QRCodeTextBox = ({ value, placeholder, onChangeText }: TextBoxProps) => {

    const [qrReader, setQrReader] = useState(false)

    return (
        <View style={styles.container}>
            <TextInput style={styles.input}
                placeholder={placeholder}
                onChangeText={onChangeText}
                placeholderTextColor={theme.colors.gray}
                multiline={false}
                numberOfLines={1}
                value={value}                
            />
            <TouchableOpacity style={styles.pastButton} onPress={() => { setQrReader(true) }} activeOpacity={.7}>
                <Ionicons name="qr-code" size={theme.icons.medium} color="white" style={styles.pastIcon} />
            </TouchableOpacity>
            <QRCodeReaderModal setValue={onChangeText} visible={qrReader} runClose={setQrReader} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "90%",
        color: theme.colors.white,
        backgroundColor: theme.input.backGround,
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 10,
        margin: 10
    },
    input: {
        color: theme.input.textColor,
    },
    pastButton: {
        width: "18%",
        position: "absolute",
        right: 0,
        top: 0,
        textAlign: "center",
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: theme.input.backGround,
        paddingVertical: 18     
    },
    pastIcon: {
        textAlign: "center",
        //paddingVertical: 20,
    }
})
