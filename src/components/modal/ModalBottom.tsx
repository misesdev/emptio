import { Modal, StyleSheet, View, Text, TouchableOpacity } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import { ReactNode, memo, useState } from "react"
import theme from "@src/theme"

var showModalBottomFunction: () => void

type ModalBottomProps = {
    title: string;
    heightPercent?: number;
    children: ReactNode;
}

const ModalBottom = ({ title, heightPercent=75, children }: ModalBottomProps) => {

    const [visible, setVisible] = useState(false)

    showModalBottomFunction = () => setVisible(true)

    return (
        <Modal transparent
            visible={visible} 
            animationType="slide"
            onRequestClose={() => setVisible(false)}
        >
            <View style={styles.overlayer}>
                <View style={[styles.modalContainer, { height: `${heightPercent}%`}]}>
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            {title}
                        </Text>
                        <TouchableOpacity 
                            onPress={() => setVisible(false)}
                        >
                            <View style={styles.closeButton}>
                            <Ionicons size={20} color={theme.colors.white} name="close" />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={theme.styles.row}>
                        {children}
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export const showModalBottom = () => {
    setTimeout(showModalBottomFunction, 20)
}

const styles = StyleSheet.create({
    overlayer: { flex: 1, justifyContent: "flex-end", backgroundColor: theme.colors.transparent,
        paddingHorizontal: 6 },
    modalContainer: { backgroundColor: theme.colors.matteBlack, borderRadius: 10, padding: 12 },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center",
        marginBottom: 10, paddingHorizontal: 10  },
    title: { fontFamily: "RobotoMono", fontSize: 18, fontWeight: "bold", color: theme.colors.white },
    closeButton: { padding: 5, backgroundColor: "FFFFFF" }
})

export default memo(ModalBottom)

