import { TouchableOpacity, StyleSheet, Text, View, ViewStyle, StyleProp, TextStyle} from 'react-native';
import { IconNames } from '@services/types/icons';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { ActivityIndicator } from 'react-native-paper';
import theme from '@src/theme';

interface Props {
    label: string,
    loading?: boolean,
    disabled?: boolean,
    leftIcon?: IconNames,
    rightIcon?: IconNames,
    style?: StyleProp<ViewStyle>,
    onPress: () => void,
    color?: string
}

const TouchableEmptio = ({ label, disabled=false, loading=false, style, leftIcon, rightIcon, onPress }: Props) => {

    return (
        <TouchableOpacity disabled={disabled} style={style} 
            onPress={onPress} activeOpacity={.7}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                {leftIcon && <Ionicons style={{ marginLeft: 10, color: theme.icons.white }} name={leftIcon} size={18} />}
                <Text style={styles.text}> {label} </Text>
                {rightIcon && <Ionicons style={{ marginRight: 10, color: theme.icons.white }} name={rightIcon} size={18} />}
                {loading && <ActivityIndicator size={18} color={theme.colors.white} />}
            </View>
        </TouchableOpacity>
    )
}

export const ButtonSuccess = ({ label, style, disabled=false, loading=false, leftIcon, rightIcon, onPress }: Props) => {
    return <TouchableEmptio label={label} 
        disabled={disabled} loading={loading} leftIcon={leftIcon}
        rightIcon={rightIcon} onPress={onPress} 
        style={[styles.button, styles.succes, style, {
            backgroundColor: disabled ? theme.colors.disabled : theme.colors.green
        }]} 
    />
}

export const ButtonPrimary = ({ label, style, disabled=false, loading=false, leftIcon, rightIcon, onPress }: Props) => {
    return <TouchableEmptio label={label} 
        disabled={disabled} loading={loading} leftIcon={leftIcon} 
        rightIcon={rightIcon} onPress={onPress} 
        style={[styles.button, styles.primary, style, {
            backgroundColor: disabled ? theme.colors.disabled : theme.colors.blue
        }]} 
    />
}

export const ButtonDanger = ({ label, style, disabled=false, loading=false, leftIcon, rightIcon, onPress }: Props) => {
    return <TouchableEmptio label={label}
        disabled={disabled} loading={loading} leftIcon={leftIcon}
        rightIcon={rightIcon} onPress={onPress} 
        style={[styles.button, styles.danger, style, {
            backgroundColor: disabled ? theme.colors.disabled : theme.colors.red
        }]} 
    />
}

export const ButtonDefault = ({ label, style, disabled=false, loading=false, leftIcon, rightIcon, onPress }: Props) => {
    return <TouchableEmptio label={label} 
        disabled={disabled} loading={loading} leftIcon={leftIcon} 
        rightIcon={rightIcon} onPress={onPress} 
        style={[styles.button, styles.default, style, {
            backgroundColor: disabled ? theme.colors.disabled : theme.colors.default
        }]} 
    />
}

export const ButtonHead = ({ label, style, leftIcon, rightIcon, onPress }: Props) => {
    return <TouchableEmptio label={label} 
        leftIcon={leftIcon} rightIcon={rightIcon} onPress={onPress} 
        style={[styles.button, styles.default, style]} 
    />
}

export const ButtonLink = ({ label, color, style, onPress }: Props) => {
    return (
        <TouchableOpacity style={[styles.buttonLink, style]} onPress={onPress} >
            <Text style={[styles.textLink, { color: color }]}>{label}</Text>
        </TouchableOpacity>
    )
}

interface IconProps {
    icon: IconNames,
    size?: number,
    style?: StyleProp<TextStyle>,
    buttonStyle?: StyleProp<TextStyle>,
    onPress: () => void
}

export const ButtonIcon = ({ icon, size, style, buttonStyle, onPress }: IconProps) => {

    size = size ? size : 20
    style = style ? style : { textAlign: "center", padding: 12 }

    /**
   * See Icon Explorer app
   * {@link https://expo.github.io/vector-icons/}
   */
    return (
        <TouchableOpacity style={buttonStyle} onPress={onPress} activeOpacity={.7}>
            <Ionicons name={icon} size={size} color={theme.icons.white} style={style} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: { margin: 10, minWidth: 150, maxWidth: "96%", paddingVertical: 14,
        borderRadius: theme.design.borderRadius },
    succes: { backgroundColor: theme.colors.green },
    primary: { backgroundColor: theme.colors.blue },
    danger: { backgroundColor: theme.colors.red },
    default: { backgroundColor: theme.colors.gray },
    text: { fontSize: 13, fontWeight: "500", textAlign: 'center', marginHorizontal: 10, 
        color: theme.colors.white },
    buttonLink: { marginVertical: 20, padding: 15, flexDirection: "row" },
    textLink: { fontSize: 16, fontWeight: "400", marginHorizontal: 5 },
})

