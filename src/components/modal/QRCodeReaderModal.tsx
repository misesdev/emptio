import { View, StyleSheet, TouchableOpacity, Modal } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Camera, CameraView } from 'expo-camera'
import { useEffect } from 'react'
import theme from '@src/theme'

interface Props {
    visible: boolean,
    setValue: (data: string) => void,
    runClose: (value: boolean) => void, // the boolean reference visible
}

export default function QRCodeReaderModal({ visible, setValue, runClose }: Props) {

    useEffect(() => {
        if(visible) checkCameraPermission()
    }, [visible])

    const checkCameraPermission = async () => {
        try {
            await Camera.requestCameraPermissionsAsync()            
        } catch { runClose(false) }
    }

    const handleBarCodeScanned = ({ type, data }: any) => {
        runClose(false)
        setValue(data)
    }
    
    return (
        <Modal visible={visible} animationType="slide" transparent 
            onRequestClose={() => runClose(false)}
            style={{ backgroundColor: "transparent", padding: 0 }}
        >
            <CameraView
                barcodeScannerSettings={{
                    barcodeTypes:['qr']
                }}
                onBarcodeScanned={handleBarCodeScanned}
                style={[styles.scanner, StyleSheet.absoluteFillObject]}
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
    container: { flex: 1, flexDirection: 'column', justifyContent: 'flex-end',
        backgroundColor: theme.colors.black },
    scanner: { justifyContent: 'center', alignItems: 'center' },
    frameCode: { width: 185, height: 185, borderRadius: 10,
        backgroundColor: "rgba(255, 255, 255, .2)" },
    closeButton: { bottom: 80, borderRadius: 50, position: 'absolute',  
        backgroundColor: "rgba(0,0,0,.5)" }
})

