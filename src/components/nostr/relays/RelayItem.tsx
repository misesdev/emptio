import { useTranslate } from "@services/translate"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useEffect, useState } from "react"
import theme from "@src/theme"
import axios from "axios"

type RelayProps = {
    relay: string,
    onDelete: (relay: string) => void
}

type RelayMetadata = {
    name?: string,
    description?: string,
    contact?: string,
    supported_nips?: Array<string>,
    version?: string
}

export const RelayItem = ({ relay, onDelete }: RelayProps) => {

    const [metadata, setMetadata] = useState<RelayMetadata>()
    const [version, setVersion] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [supportedNips, setSupportedNips] = useState<string>("")

    useEffect(() => { 
        loadRelayData() 
        useTranslate("commons.version").then(setVersion)
        useTranslate("commons.description").then(setDescription)
        useTranslate("message.relay.supported_nips").then(setDescription)
    }, [])

    const loadRelayData = async () => {
        try {
            const httpClient = axios.create({ headers: { Accept: "application/nostr+json" } })

            const response = await httpClient.get(relay.replace("wss", "https"))

            if (response.status == 200) setMetadata(response.data as RelayMetadata)
        } 
        catch { }
    }

    return (
        <>
            <View style={styles.relay_container}>
                <View style={[styles.relay_row, { borderBottomWidth: .5, borderBottomColor: theme.colors.default }]}>
                    <View style={{ width: "60%" }}>
                        <Text style={{ color: theme.colors.gray }}>{metadata?.name ?? relay}</Text>
                    </View>
                    <View style={{ width: "40%", flexDirection: "row-reverse" }}>
                        <TouchableOpacity activeOpacity={.7} onPress={() => onDelete(relay)} style={styles.button_delete}>
                            <Ionicons name="close" size={theme.icons.mine} color={theme.colors.white} />
                        </TouchableOpacity>
                    </View>
                </View>
                {metadata?.description &&
                    <View style={styles.relay_row}>
                        <View style={{ width: "50%" }}>
                            <Text style={{ color: theme.colors.white }}>{description}</Text>
                        </View>
                        <View style={{ width: "50%" }}>
                            <Text style={{ color: theme.colors.gray }}>{metadata.description}</Text>
                        </View>
                    </View>
                }

                {relay &&
                    <View style={styles.relay_row}>
                        <View style={{ width: "50%" }}>
                            <Text style={{ color: theme.colors.white }}>URL</Text>
                        </View>
                        <View style={{ width: "50%" }}>
                            <Text style={{ color: theme.colors.gray }}>{relay}</Text>
                        </View>
                    </View>
                }

                {metadata?.version &&
                    <View style={styles.relay_row}>
                        <View style={{ width: "50%" }}>
                            <Text style={{ color: theme.colors.white }}>{version}</Text>
                        </View>
                        <View style={{ width: "50%" }}>
                            <Text style={{ color: theme.colors.gray }}>{metadata.version}</Text>
                        </View>
                    </View>
                }

                {metadata?.supported_nips && metadata.supported_nips.length &&
                    <View style={{ padding: 5 }}>
                        <View style={{}}>
                            <Text style={{ color: theme.colors.white }}>{supportedNips}</Text>
                        </View>
                        <ScrollView contentContainerStyle={{ padding: 10, flexDirection: "row" }} horizontal>
                            {metadata.supported_nips.map((nip, index) => <View key={index} style={styles.nip}><Text style={styles.nip_text}>{nip}</Text></View>)}
                        </ScrollView>
                    </View>
                }
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    relay_container: { width: "94%", padding: 12, marginVertical: 5, borderRadius: 10, backgroundColor: "rgba(0, 55, 55, .2)" },
    button_delete: { borderRadius: 20, padding: 2, backgroundColor: theme.colors.default },
    relay_row: { width: "100%", flexDirection: "row", padding: 5 },
    nip: { borderRadius: 8, margin: 10, padding: 5, backgroundColor: theme.colors.black },
    nip_text: { color: theme.colors.gray, fontWeight: "bold" }
})
