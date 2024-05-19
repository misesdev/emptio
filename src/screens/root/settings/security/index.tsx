
import { StyleSheet, View, Text, ScrollView } from "react-native"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { FormControlSwitch } from "@components/form/FormControl"
import { useEffect, useState } from "react"
import { authService } from "@src/core/authManager"
import { pushMessage } from "@src/services/notification"
import { getSettings, saveSettings } from "@src/services/memory/settings"
import theme from "@src/theme"

const ManageSecurityScreen = ({ navigation }: any) => {

    const [useBiometrics, setUseBiometrics] = useState<boolean>()

    useEffect(() => {
        // load data
        loadDataSettings()
    }, [])

    const loadDataSettings = async () => {
        const settings = getSettings()
        setUseBiometrics(settings.useBiometrics)
    }

    const onHandleSetAuthenticate = async (value: boolean) => {

        if (value) {
            const access = await authService.checkBiometric()

            if (!access)
                return pushMessage("Erro ao authenticar com biometria.")
        }

        const settings = getSettings()
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