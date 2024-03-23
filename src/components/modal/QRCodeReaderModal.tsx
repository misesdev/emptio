import { View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { CameraView, useCameraPermissions } from "expo-camera/next"
import { Ionicons } from '@expo/vector-icons';
import theme from '@src/theme';

type Props = {
    visible: boolean,
    setValue: (data: string) => void,
    runClose: (value: boolean) => void, // the boolean reference visible
}

export default function QRCodeReaderModal({ visible, setValue, runClose }: Props) {

    useCameraPermissions()

    const handleBarCodeScanned = ({ type, data }: { type: any, data: any }) => {
        runClose(false)
        setValue(data)
    }

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={() => runClose(false)}
            style={{ backgroundColor: "transparent", padding: 0 }}
        >
            <CameraView
                onBarcodeScanned={handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr", "pdf417"],
                }}
                style={[styles.scanner, { ...StyleSheet.absoluteFillObject }]}
            >
                <View style={styles.frameCode}></View>

                <TouchableOpacity onPress={() => { runClose(false); }} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="white" style={{ textAlign: "center", padding: 10 }} />
                </TouchableOpacity>
            </CameraView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        backgroundColor: theme.colors.black,
    },
    scanner: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    frameCode: {
        width: 185,
        height: 185,
        borderRadius: 10,
        backgroundColor: "rgba(255, 255, 255, .2)",
    },
    closeButton: {
        borderWidth: 1,
        borderColor: theme.colors.white,
        borderRadius: 50,
        position: 'absolute',
        bottom: 80
    }
})

