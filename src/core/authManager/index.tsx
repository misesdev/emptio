import { useTranslate } from "@/src/services/translate"
import { authenticateAsync, hasHardwareAsync } from "expo-local-authentication"

const checkBiometric = async () => {
    const isBiometricAvailable = await hasHardwareAsync()

    if (isBiometricAvailable) {
        const { success } = await authenticateAsync({
            promptMessage: useTranslate("commons.authenticate.message")
        })

        return success
    }

    return false
}

export const authService = {
    checkBiometric
}