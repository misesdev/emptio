
import { StyleSheet, ScrollView } from "react-native"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { FormControlSwitch } from "@components/form/FormControl"
import { useState } from "react"
import { authService } from "@src/core/authManager"
import { pushMessage } from "@src/services/notification"
import { getSettings, saveSettings } from "@src/services/memory/settings"
import theme from "@src/theme"
import { useTranslateService } from "@/src/providers/translateProvider"
import { useSettings } from "@/src/providers/settingsProvider"

const ManageSecurityScreen = ({ navigation }: any) => {

    const {settings} = useSettings()
    const { useTranslate } = useTranslateService()
    const [useBiometrics, setUseBiometrics] = useState<boolean>(settings.useBiometrics ?? false)

    const onHandleSetAuthenticate = async (value: boolean) => {

        if (value) {
            const access = await authService.checkBiometric()

            if (!access)
                return pushMessage("Erro ao authenticar com biometria.")
        }

        settings.useBiometrics = value
        saveSettings(settings)

        setUseBiometrics(value)
    }

    return (
        <>
            <HeaderScreen title="Security" onClose={() => navigation.navigate("user-menu-stack")} />
            <ScrollView contentContainerStyle={theme.styles.scroll_container} >

                <FormControlSwitch label="Use Biometrics" value={useBiometrics} onChangeValue={onHandleSetAuthenticate} />

            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({

})

export default ManageSecurityScreen