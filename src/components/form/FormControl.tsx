import { View, Text, StyleSheet, TextInput, Switch, ReturnKeyTypeOptions } from "react-native"
import theme from "@src/theme"

type FormControlProps = {
    label: string,
    value?: string,   
    type?: "none" | "password", 
    isTextArea?: boolean,
    textCenter?: boolean,
    autoComplete?: boolean,
    onBlur?: () => void,
    onFocus?: () => void,
    onChangeText: (value: string) => void,
    fullScreen?: boolean,
    showLabel?: boolean,
    returnKeyTipe?: ReturnKeyTypeOptions, //"default" | "go" | "done"
    onSubmitEditing?: () => void
}

export const FormControl = ({ label, showLabel=true, value, onChangeText, onFocus, onBlur, 
    textCenter, isTextArea, autoComplete=false, type="none", fullScreen=false,
    returnKeyTipe="default", onSubmitEditing }: FormControlProps) => {

    return (
        <View style={styles.control}>
            <View style={[styles.container, { width: fullScreen ? "100%" : "94%" }]}>
                {showLabel && <Text style={styles.label}>{label}</Text>}
                <TextInput style={[styles.input, { textAlign: textCenter ? "center" : "auto", minHeight: isTextArea ? 100 : 50 }]}
                    placeholder={label}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onChangeText={onChangeText}
                    clearTextOnFocus={true}
                    placeholderTextColor={theme.input.placeholderColor}
                    numberOfLines={isTextArea ? 5 : 1}
                    multiline={isTextArea}
                    value={value}
                    returnKeyType={returnKeyTipe}
                    onSubmitEditing={onSubmitEditing}
                    blurOnSubmit={returnKeyTipe == "default"}
                    textContentType={type}
                    autoComplete={autoComplete ? undefined : "off" }
                />
            </View>
        </View>
    )
}

type FormSwitchProps = {
    label: string,
    value?: boolean,  
    onChangeValue: (value: boolean) => void,  
    fullScreen?: boolean
}

export const FormControlSwitch = ({ label, value, onChangeValue, fullScreen = false }: FormSwitchProps) => {
    return (
        <View style={styles.control}>
            <View style={[styles.container, { width: fullScreen ? "100%" : "94%", flexDirection: "row", paddingVertical: 16 }]}>
                <View style={{ width: "70%" }}>
                    <Text style={styles.labelSwitch}>{label}</Text>
                </View>
                <View style={{ width: "30%", flexDirection: "row-reverse" }}>
                    <Switch 
                        value={value}
                        onValueChange={onChangeValue}
                        trackColor={{ false: theme.colors.gray }}
                        style={{ marginHorizontal: 12 }}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    control: { width: "100%", alignItems: "center", paddingVertical: 5 },
    container: { color: theme.colors.white, backgroundColor: theme.input.backGround, 
        borderRadius: 10, margin: 5 },
    label: { width: "100%", fontSize: 12, fontWeight: "400", marginTop: 10, paddingHorizontal: 20, color: theme.colors.white },
    labelSwitch: { width: "100%", fontSize: 15, fontWeight: "400", marginTop: 10, paddingHorizontal: 20, color: theme.colors.white },
    input: { paddingVertical: 15, paddingHorizontal: 30, color: theme.input.textColor }
})
