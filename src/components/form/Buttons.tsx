import { TouchableOpacity, StyleSheet, Text, View, ViewStyle, StyleProp, TextStyle} from 'react-native';
import { IconNames } from '@services/types/icons';
import Ionicons from 'react-native-vector-icons/Ionicons'
import theme from '@src/theme';

type Props = {
    label: string,
    disabled?: boolean,
    leftIcon?: IconNames,
    rightIcon?: IconNames,
    style?: StyleProp<ViewStyle>,
    onPress: () => void,
    color?: string
}

const TouchableEmptio = ({ label, disabled=false, style, leftIcon, rightIcon, onPress }: Props) => {

    return (
        <TouchableOpacity disabled={disabled} style={style} onPress={onPress} activeOpacity={.7}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                {leftIcon && <Ionicons style={{ marginLeft: 10, color: theme.icons.white }} name={leftIcon} size={18} />}
                <Text style={styles.text}> {label} </Text>
                {rightIcon && <Ionicons style={{ marginRight: 10, color: theme.icons.white }} name={rightIcon} size={18} />}
            </View>
        </TouchableOpacity>
    )
}

export const ButtonSuccess = ({ label, style, disabled=false, leftIcon, rightIcon, onPress }: Props) => {
    return <TouchableEmptio label={label} disabled={disabled} leftIcon={leftIcon} rightIcon={rightIcon} onPress={onPress} style={[styles.button, styles.succes, style]} />
}

export const ButtonPrimary = ({ label, style, disabled=false, leftIcon, rightIcon, onPress }: Props) => {
    return <TouchableEmptio label={label} disabled={disabled} leftIcon={leftIcon} rightIcon={rightIcon} onPress={onPress} style={[styles.button, styles.primary, style]} />
}

export const ButtonDanger = ({ label, style, disabled=false, leftIcon, rightIcon, onPress }: Props) => {
    return <TouchableEmptio label={label} disabled={disabled} leftIcon={leftIcon} rightIcon={rightIcon} onPress={onPress} style={[styles.button, styles.danger, style]} />
}

export const ButtonDefault = ({ label, style, leftIcon, rightIcon, onPress }: Props) => {
    return <TouchableEmptio label={label} leftIcon={leftIcon} rightIcon={rightIcon} onPress={onPress} style={[styles.button, styles.default, style]} />
}

export const ButtonHead = ({ label, style, leftIcon, rightIcon, onPress }: Props) => {
    return <TouchableEmptio label={label} leftIcon={leftIcon} rightIcon={rightIcon} onPress={onPress} style={[styles.button, styles.default, style]} />
}

export const ButtonLink = ({ label, color, style, onPress }: Props) => {
    return (
        <TouchableOpacity style={[styles.buttonLink, style]} onPress={onPress} >
            <Text style={[styles.textLink, { color: color }]}>{label}</Text>
        </TouchableOpacity>
    )
}

type IconProps = {
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
    button: { margin: 10, minWidth: 150, maxWidth: "96%", paddingVertical: 14, borderRadius: 10 },
    succes: { backgroundColor: theme.colors.green },
    primary: { backgroundColor: theme.colors.blue },
    danger: { backgroundColor: theme.colors.red },
    default: { backgroundColor: theme.colors.gray },
    text: { fontSize: 13, fontWeight: "500", textAlign: 'center', marginHorizontal: 10, color: theme.colors.white },
    buttonLink: { marginVertical: 20, padding: 15, flexDirection: "row" },
    textLink: { fontSize: 16, fontWeight: "400", marginHorizontal: 5 },
})

