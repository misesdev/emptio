
import { ScrollView, View } from "react-native"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { FormControlSwitch } from "@components/form/FormControl"
import { useAccount } from "@src/context/AccountContext"
import { useTranslateService } from "@src/providers/TranslateProvider"
import { useService } from "@src/providers/ServiceProvider"
import { StackScreenProps } from "@react-navigation/stack"
import { pushMessage } from "@services/notification"
import { useState } from "react"
import theme from "@src/theme"

const ManageSecurityScreen = ({ navigation }: StackScreenProps<any>) => {

    const { authService } = useService()
    const { settings, setSettings } = useAccount()
    const { useTranslate } = useTranslateService()
    const [useBiometrics, setUseBiometrics] = useState<boolean>(settings.useBiometrics ?? false)

    const onHandleSetAuthenticate = async (value: boolean) => {

        if (value) {
            const access = await authService.checkBiometrics()
            if (!access)
                return pushMessage(useTranslate("message.default_error"))
        }

        setUseBiometrics(value)
        settings.useBiometrics = value
        if(setSettings) 
            setSettings(settings)
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

export default ManageSecurityScreen
