import { View, StyleSheet, TouchableOpacity, Modal } from 'react-native'
import { Camera, useCameraDevices, useFrameProcessor } from "react-native-vision-camera"
import { BarcodeFormat, scanBarcodes } from 'vision-camera-code-scanner'
import Ionicons from '@react-native-vector-icons/ionicons'
import { useEffect } from 'react'
import { runOnJS } from 'react-native-reanimated'
import theme from '@src/theme'

type Props = {
    visible: boolean,
    setValue: (data: string) => void,
    runClose: (value: boolean) => void, // the boolean reference visible
}

export default function QRCodeReaderModal({ visible, setValue, runClose }: Props) {

    const devices = useCameraDevices();

    useEffect(() => {
        (async () => {
            try {
                await Camera.requestCameraPermission()            
            } catch { runClose(false) }
        })()
    }, [])

    const handleBarCodeScanned = ({ type, data }: any) => {
        runClose(false)
        setValue(data)
    }
    
    const frameProcessor = useFrameProcessor((frame) => {
        'worklet'
        const qrcodes = scanBarcodes(frame, [BarcodeFormat.QR_CODE])
        if(qrcodes.length) 
            runOnJS(handleBarCodeScanned)(qrcodes[0].content)
    }, [])

    if(!devices.length) return <></>

    return (
        <Modal visible={visible} animationType="slide" transparent 
            onRequestClose={() => runClose(false)}
            style={{ backgroundColor: "transparent", padding: 0 }}
        >
            <Camera
                device={devices[0]} isActive
                frameProcessor={frameProcessor}
                style={[styles.scanner, StyleSheet.absoluteFillObject]}
            >
                <View style={styles.frameCode}></View>

                <TouchableOpacity onPress={() => { runClose(false); }} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="white" style={{ textAlign: "center", padding: 10 }} />
                </TouchableOpacity>
            </Camera>
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
        bottom: 80,
        // borderWidth: 1,
        // borderColor: theme.colors.white,
        borderRadius: 50,
        position: 'absolute',  
        backgroundColor: "rgba(0,0,0,.5)"      
    }
})

