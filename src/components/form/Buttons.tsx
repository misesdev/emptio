import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StyleProp } from 'react-native';
import { TextStyle } from 'react-native';
import theme from '@src/theme';

type Props = {
    label: string,
    icon?: "add" | "add-circle" | "arrow-forward-circle" | "trash" | "bookmarks" | "clipboard" | "duplicate" | "open",
    style?: StyleProp<TextStyle>,
    onPress: () => void
}

export const ButtonSuccess = ({ label, style, icon, onPress }: Props) => {

    return (
        <TouchableOpacity style={[styles.button, styles.buttonSuccess, style]} onPress={onPress}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={styles.buttonText}> {label} </Text>
                {icon &&  <Ionicons name={icon} size={18} style={styles.icon} color={theme.icons.gray} /> }
            </View>
        </TouchableOpacity>
    )
}

export const ButtonPrimary = ({ label, style, icon, onPress }: Props) => {

    return (
        <TouchableOpacity style={[styles.button, styles.buttonPrimary, style]} onPress={onPress}>
           <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={styles.buttonText}> {label} </Text>
                {icon && <Ionicons name={icon} size={18} color={theme.icons.gray} /> }
            </View>       
        </TouchableOpacity>
    )
}

export const ButtonDanger = ({ label, style, icon, onPress }: Props) => {

    return (
        <TouchableOpacity style={[styles.button, styles.buttonDanger, style]} onPress={onPress}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={styles.buttonText}> {label} </Text>
                {icon && <Ionicons name={icon} size={18} color={theme.icons.gray} /> }
            </View>
        </TouchableOpacity>
    )
}

export const ButtonDefault = ({ label, style, icon, onPress }: Props) => {

    return (
        <TouchableOpacity style={[styles.button, styles.ButtonDefault, style]} onPress={onPress}>
           <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={styles.buttonText}> {label} </Text>
                {icon && <Ionicons name={icon} size={18} color={theme.icons.gray} /> }
            </View>
        </TouchableOpacity>
    )
}

export const ButtonHead = ({ label, style, icon, onPress }: Props) => {

    return (
        <TouchableOpacity style={[styles.button, styles.ButtonDefault, style]} onPress={onPress}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={styles.buttonText}> {label} </Text>
                {icon && <Ionicons name={icon} size={18} color={theme.icons.gray} /> }
            </View>        
        </TouchableOpacity>
    )
}

type IconProps = {
    icon: any,
    size?: number | undefined,
    iconStyle?: {} | undefined,
    buttonStyles: Array<{}> | undefined,
    onPress: () => void
}

export const ButtonIcon = ({ icon, size, iconStyle, buttonStyles, onPress }: IconProps) => {

    size = size ? size : 20
    iconStyle = iconStyle ? iconStyle : { textAlign: "center", padding: 12 }

    /**
   * See Icon Explorer app
   * {@link https://expo.github.io/vector-icons/}
   */
    return (
        <TouchableOpacity style={buttonStyles} onPress={onPress}>
            <Ionicons name={icon} size={size} color={theme.icons.gray} style={iconStyle} />
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
    buttonSuccess: {
        backgroundColor: theme.colors.green
    },
    buttonPrimary: {
        backgroundColor: theme.colors.blue
    },
    buttonDanger: {
        backgroundColor: theme.colors.red
    },
    ButtonDefault: {
        backgroundColor: theme.colors.gray
    },
    buttonText: {
        color: theme.colors.white,
        fontSize: 13,
        fontWeight: "400",
        textAlign: 'center',
        marginHorizontal: 28
    },
    icon: {
        marginHorizontal: 10
    }
})

