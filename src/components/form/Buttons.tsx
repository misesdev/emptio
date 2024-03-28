import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { IconNames } from '@src/services/types/icons';
import { Ionicons } from '@expo/vector-icons';
import { StyleProp } from 'react-native';
import { TextStyle } from 'react-native';
import theme from '@src/theme';

type Props = {
    label: string,
    icon?: IconNames,
    style?: StyleProp<TextStyle>,
    onPress: () => void
}

const TouchableEmptio = ({ label, style, icon, onPress }: Props) => {

    return (
        <TouchableOpacity style={style} onPress={onPress} activeOpacity={.7}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={styles.text}> {label} </Text>
                {icon && <Ionicons name={icon} size={18} color={theme.icons.gray} />}
            </View>
        </TouchableOpacity>
    )
}

export const ButtonSuccess = ({ label, style, icon, onPress }: Props) => {
    return <TouchableEmptio label={label} icon={icon} onPress={onPress} style={[[styles.button, styles.succes, style]]} />
}

export const ButtonPrimary = ({ label, style, icon, onPress }: Props) => {
    return <TouchableEmptio label={label} icon={icon} onPress={onPress} style={[[styles.button, styles.primary, style]]} />
}

export const ButtonDanger = ({ label, style, icon, onPress }: Props) => {
    return <TouchableEmptio label={label} icon={icon} onPress={onPress} style={[[styles.button, styles.danger, style]]} />
}

export const ButtonDefault = ({ label, style, icon, onPress }: Props) => {
    return <TouchableEmptio label={label} icon={icon} onPress={onPress} style={[[styles.button, styles.default, style]]} />
}

export const ButtonHead = ({ label, style, icon, onPress }: Props) => {
    return <TouchableEmptio label={label} icon={icon} onPress={onPress} style={[[styles.button, styles.default, style]]} />
}

type IconProps = {
    icon: IconNames,
    size?: number,
    style?: StyleProp<TextStyle>,
    buttonStyle: StyleProp<TextStyle>,
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
            <Ionicons name={icon} size={size} color={theme.icons.gray} style={style} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        margin: 10,
        minWidth: 150,
        paddingVertical: 14,
        borderRadius: 25,
    },
    succes: {
        backgroundColor: theme.colors.green
    },
    primary: {
        backgroundColor: theme.colors.blue
    },
    danger: {
        backgroundColor: theme.colors.red
    },
    default: {
        backgroundColor: theme.colors.gray
    },
    text: {
        color: theme.colors.white,
        fontSize: 13,
        fontWeight: "500",
        textAlign: 'center',
        marginHorizontal: 28
    },
    icon: {
        marginHorizontal: 10
    }
})

