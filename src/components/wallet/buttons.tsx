import { StyleProp, View, ViewStyle } from "react-native"
import { ButtonPrimary } from "../form/Buttons"
import QRCodeReaderModal from "../modal/QRCodeReaderModal"
import { useState } from "react"

type Props = {
    label: string,
    onChangeText: (value: string) => void,
    style?: StyleProp<ViewStyle>
}

export const ButtonScanQRCode = ({ style, label, onChangeText }: Props) => {

    const [qrReader, setQrReader] = useState(false)
    
    return (
        <View>
            <ButtonPrimary style={style} leftIcon="qr-code" label={label} onPress={() => setQrReader(!qrReader)} />
            <QRCodeReaderModal setValue={onChangeText} visible={qrReader} runClose={setQrReader} />
        </View>
    )
}
