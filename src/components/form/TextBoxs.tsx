import theme from "@src/theme"
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import QRCodeReaderModal from "@components/modal/QRCodeReaderModal"
import { useState } from "react"

type TextBoxProps = {
    value?: string | ""
    placeholder?: string,
    onChangeText: (text: string) => void
}

export const TextBox = ({ value, placeholder, onChangeText }: TextBoxProps) => {

    return (
        <View style={styles.container}>
            <TextInput style={styles.input}
                placeholder={placeholder}
                onChangeText={onChangeText}
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
                value={value}
            />
            <TouchableOpacity style={styles.pastButton} onPress={() => { setQrReader(true) }}>
                <Ionicons name="qr-code" size={theme.icons.medium} color="white" style={styles.pastIcon} />
            </TouchableOpacity>
            <QRCodeReaderModal setValue={onChangeText} visible={qrReader} runClose={setQrReader} />
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        width: "90%",
        color: "#fff",
        backgroundColor: theme.input.backGround,
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 24,
        margin: 10
    },
    input: {
        textAlign: "center",
        color: theme.input.textColor,
    },
    pastButton: {
        width: "20%",
        position: "absolute",
        right: 0,
        top: 0,
        textAlign: "center",
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
        backgroundColor: theme.input.backGround,
        padding: 2.4,
    },
    pastIcon: {
        textAlign: "center",
        paddingVertical: 15,
    }
})
