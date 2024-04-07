import { View, Text, StyleSheet, TextInput } from "react-native"
import theme from "@/src/theme"

type FormControlProps = {
    label: string,
    value?: string,    
    isTextArea?: boolean,
    textCenter?: boolean,
    onBlur?: () => void,
    onFocus?: () => void,
    onChangeText: (value: string) => void,
}

export const FormControl = ({ label, value, onChangeText, onFocus, onBlur, textCenter, isTextArea }: FormControlProps) => {

    return (
        <View style={styles.control}>
            <View style={styles.container}>
                <Text style={styles.label}>{label}</Text>
                <TextInput style={[styles.input, { textAlign: textCenter ? "center" : "auto" }]} //ref={textInputRef}
                    placeholder={label}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onChangeText={onChangeText}
                    clearTextOnFocus={true}
                    placeholderTextColor={theme.colors.gray}
                    numberOfLines={isTextArea ? 3 : 1}
                    multiline={isTextArea}
                    value={value}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    control: {
        width: "100%",
        alignItems: "center",
        paddingVertical: 10,
    },
    container: {
        width: "90%",
        color: theme.colors.white,
        backgroundColor: theme.input.backGround,
        borderRadius: 24,
        margin: 5
    },
    label: {        
        width: "100%",
        fontSize: 12,
        fontWeight: "400",
        marginTop: 10,
        paddingHorizontal: 20,
        color: theme.colors.white
    },
    input: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        color: theme.input.textColor,
    }
})