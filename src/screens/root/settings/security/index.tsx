
import { StyleSheet, ScrollView, View } from "react-native"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { FormControlSwitch } from "@components/form/FormControl"
import { useState } from "react"
import { authService } from "@src/core/authManager"
import { pushMessage } from "@services/notification"
import { getSettings, saveSettings } from "@services/memory/settings"
import { useTranslateService } from "@src/providers/translateProvider"
import { useSettings } from "@src/providers/settingsProvider"
import theme from "@src/theme"
import { StackScreenProps } from "@react-navigation/stack"

const ManageSecurityScreen = ({ navigation }: StackScreenProps<any>) => {

    const { settings, setSettings } = useSettings()
    const { useTranslate } = useTranslateService()
    const [useBiometrics, setUseBiometrics] = useState<boolean>(settings.useBiometrics ?? false)

    const onHandleSetAuthenticate = async (value: boolean) => {

        if (value) {
            const access = await authService.checkBiometric()
            if (!access)
                return pushMessage(useTranslate("message.default_error"))
        }

        setUseBiometrics(value)
        settings.useBiometrics = value
        if(setSettings) setSettings(settings)
        saveSettings(settings)
    }

    return (
        <View style={{ flex: 1 }}>
            <HeaderScreen title="Security" onClose={() => navigation.goBack()} />
            <ScrollView contentContainerStyle={theme.styles.scroll_container} >

                <FormControlSwitch label="Use Biometrics" value={useBiometrics} onChangeValue={onHandleSetAuthenticate} />

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({

})

export default ManageSecurityScreen
