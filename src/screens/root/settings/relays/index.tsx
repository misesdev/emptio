import { StyleSheet, View, ScrollView, Text } from "react-native"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { ButtonPrimary } from "@components/form/Buttons"
import { useTranslateService } from "@src/providers/translateProvider"
import useNDKStore from "@services/zustand/ndk"
import { StackScreenProps } from "@react-navigation/stack"
import { SectionHeader } from "@components/general/section/headers"
import { RelayList } from "./commons/list"
import theme from "@src/theme"
import useRelaySettings from "../hooks/use-relay-settings"

const ManageRelaysScreen = ({ navigation }: StackScreenProps<any>) => {

    const { ndk } = useNDKStore()
    const { useTranslate } = useTranslateService()
    const { relayData, openRelay } = useRelaySettings({ navigation })
 
    return (
        <View style={{ flex: 1 }}>
            <HeaderScreen 
                title={useTranslate("settings.relays")} 
                onClose={() => navigation.goBack()}
            />
            <ScrollView 
                contentContainerStyle={theme.styles.scroll_container} 
            >
                {!ndk.pool.relays.size && 
                    <Text style={{ color: theme.colors.gray }}>
                        {useTranslate("message.relay.empty")}
                    </Text>
                }
                {relayData &&
                    <View>
                        <SectionHeader 
                            label={useTranslate("labels.relays.connecteds")+" ("+relayData.connected.length+")"} 
                        />
                        <RelayList relays={relayData.connected} onPressRelay={openRelay} />
                    </View>
                }
                {relayData &&
                    <View>
                        <SectionHeader 
                            label={useTranslate("labels.relays.disconnecteds")+" ("+relayData.disconected.length+")"}
                        />
                        <RelayList relays={relayData.disconected} onPressRelay={openRelay} />
                    </View>
                }

                <View style={{ height: 100 }}></View>

            </ScrollView>
            <View style={styles.buttonarea}>
                <ButtonPrimary 
                    label={useTranslate("labels.relays.add")} 
                    onPress={() => navigation.navigate("add-relay-stack")} 
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonarea: { width: "100%", position: "absolute", alignItems: "center", bottom: 30 }
})

export default ManageRelaysScreen
