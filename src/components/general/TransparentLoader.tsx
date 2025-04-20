import theme from "@src/theme"
import { Modal, View, StyleSheet } from "react-native"
import { ActivityIndicator } from "react-native-paper"

interface Props {
    active: boolean
}

const TransparentLoader = ({ active }: Props) => {

    if(!active) return <></>

    return (
        <Modal transparent >
            <View style={styles.modalContainer}>
                <ActivityIndicator size={30} color={theme.colors.white} />
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContainer: { flex: 1, alignItems: "center", justifyContent: "center",
        backgroundColor: theme.colors.semitransparent }
})

export default TransparentLoader
