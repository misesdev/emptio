import { useTranslate } from "@services/translate"
import ReactNativeBiometrics from "react-native-biometrics";

const checkBiometric = async () => {
    
    const rnBiometrics = new ReactNativeBiometrics()
    const { available } = await rnBiometrics.isSensorAvailable()

    if (available) {
        const { success } = await rnBiometrics.simplePrompt({
            promptMessage: await useTranslate("commons.authenticate.message")
        })
        return success
    }

    return false
}

export const authService = {
    checkBiometric
}
