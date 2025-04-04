import { HeaderScreen } from "@components/general/HeaderScreen"
import { useTranslateService } from "@src/providers/translateProvider"
import MessageBox, { showMessage } from "@components/general/MessageBox"
import Ionicons from "react-native-vector-icons/Ionicons"
import { StyleSheet, View, ScrollView, FlatList, Text } from "react-native"
import useNDKStore from "@services/zustand/ndk"
import { pushMessage } from "@services/notification"
import { useEffect, useState } from "react"
import { ButtonDefault } from "@components/form/Buttons"
import { SectionContainer } from "@components/general/section"
import { storageService } from "@services/memory"
import theme from "@src/theme"
import axios from "axios"
import { userService } from "@/src/services/user"
import { User } from "@/src/services/memory/types"
import { ProfilePicture } from "@/src/components/nostr/user/ProfilePicture"
import { getUserName } from "@/src/utils"
import { ActivityIndicator } from "react-native-paper"
import { NDKRelay } from "@nostr-dev-kit/ndk-mobile"

interface RelayMetadata {
    name?: string,
    description?: string,
    contact?: string,
    supported_nips?: Array<string>,
    software?: string,
    version?: string,
    pubkey?: string
}

const RelayScreen = ({ navigation, route }: any) => {

    const { ndk } = useNDKStore()
    const relay = route.params.relay as NDKRelay
    const { useTranslate } = useTranslateService()
    const [connected, setConnected] = useState<boolean>(false)
    const [metadata, setMetadata] = useState<RelayMetadata>()
    const [loading, setLoading] = useState<boolean>(true)
    const [connecting, setConecting] = useState<boolean>(false)
    const [manteiner, setManteiner] = useState<User>()

    useEffect(() => {
        loadRelayData() 
        setConnected(relay.connected)
    }, [])

    useEffect(() => {
        if(metadata?.pubkey && !manteiner?.pubkey) {
            userService.getProfile(metadata.pubkey).then(setManteiner)
        }
    }, [metadata])

    const loadRelayData = async () => {
        try {
            setLoading(true)

            const httpClient = axios.create({ headers: { Accept: "application/nostr+json" } })

            const response = await httpClient.get(relay.url.replace("wss", "https"))
            
            if (response.status == 200) 
                setMetadata(response.data as RelayMetadata)
        } 
        catch {
            pushMessage("Nao foi possivel obter os dados deste relay")
        }
        finally {
            setLoading(false)
        }
    }

    const handleConnect = async () => {
        setConecting(true)
        let ndkRelay = ndk.pool.getRelay(relay.url)

        ndkRelay?.connect().then(() => {
            setConecting(false)
            setConnected(true)
        }).catch(() => {
            pushMessage(useTranslate("message.default_error"))
            setConecting(false)
        })

        setTimeout(() => setConecting(false), 300)
    }

    const handleDisconect = async () => {
        let ndkRelay = ndk.pool.getRelay(relay.url)
        ndkRelay.disconnect()
        setConnected(false)
    }

    const handleDelete = () => {
        showMessage({
            title: useTranslate("message.relay.title_delete"),
            message: useTranslate("message.relay.confirm_delete"),
            action: {
                label: useTranslate("commons.delete"),
                onPress: async () => {       

                    ndk.pool.removeRelay(relay.url)

                    await storageService.relays.delete(relay.url)
                   
                    pushMessage(useTranslate("message.relay.delete_success"))

                    navigation.reset({
                        index: 1,
                        routes: [
                            { name: "core-stack" },
                            { name: "user-menu-stack" },
                            { name: "manage-relays-stack" }
                        ]
                    })
                }
            }
        })
    }

    return (
        <View style={styles.container}>
            <HeaderScreen 
                title="Relay"
                onClose={() => navigation.goBack()}
            />

            <ScrollView style={{ flex: 1, padding: 10 }}>
                
                <View style={{ padding: 10 }}>
                    <Text style={styles.title}>
                        {relay.url.replace("wss://", "").slice(0, -1)} {" "}
                        <Ionicons name="ellipse" 
                            size={15} color={connected ? theme.colors.green : theme.colors.gray } 
                        />
                    </Text>
                    {!loading && metadata?.description &&
                        <Text style={styles.description}>
                            {metadata?.description}
                        </Text>
                    }
                </View>
                
                {loading && 
                    <ActivityIndicator size={20} color={theme.colors.gray} />
                }

                {!loading && 
                    <>
                    {manteiner?.pubkey && 
                        <View style={styles.section}>
                            <View style={{ paddingVertical: 10, width: "100%", alignItems: "center" }}>
                                <ProfilePicture user={manteiner} size={100} />
                            </View>
                            <View style={{ width: "100%" }}>
                                <Text style={styles.title}>
                                    {getUserName(manteiner)}
                                </Text>
                            </View>
                        </View>
                    }

                    <View style={styles.section}>
                        <SectionContainer style={styles.sectionContainer}>
                            {metadata?.name && 
                                <View style={styles.sectionLine}>
                                    <View style={{ width: "30%" }}>
                                        <Text style={{ color: theme.colors.white }}>
                                            {useTranslate("commons.name")}
                                        </Text>
                                    </View> 
                                    <View style={{ width: "70%" }}>
                                        <Text style={{ color: theme.colors.white }}>
                                            {metadata.name}
                                        </Text>
                                    </View>
                                </View>
                            }
                            {metadata?.contact && 
                                <View style={styles.sectionLine}>
                                    <View style={{ width: "30%" }}>
                                        <Text style={{ color: theme.colors.white }}>
                                            Contact
                                        </Text>
                                    </View> 
                                    <View style={{ width: "70%" }}>
                                        <Text style={{ color: theme.colors.white }}>
                                            {metadata.contact}
                                        </Text>
                                    </View>
                                </View>
                            }
                            {metadata?.software && 
                                <View style={styles.sectionLine}>
                                    <View style={{ width: "30%" }}>
                                        <Text style={{ color: theme.colors.white }}>
                                            Software
                                        </Text>
                                    </View> 
                                    <View style={{ width: "70%" }}>
                                        <Text style={{ color: theme.colors.white }}>
                                            {metadata.software}
                                        </Text>
                                    </View>
                                </View>
                            }
                            {metadata?.version && 
                                <View style={styles.sectionLine}>
                                    <View style={{ width: "30%" }}>
                                        <Text style={{ color: theme.colors.white }}>
                                            {useTranslate("commons.version")}
                                        </Text>
                                    </View> 
                                    <View style={{ width: "70%" }}>
                                        <Text style={{ color: theme.colors.white }}>
                                            {metadata.version}
                                        </Text>
                                    </View>
                                </View>
                            }
                            {metadata?.supported_nips?.length && 
                                <View style={styles.sectionLine}>
                                    <View style={{ width: "30%" }}>
                                        <Text style={{ color: theme.colors.white }}>
                                            {useTranslate("message.relay.supported_nips")}
                                        </Text>
                                    </View> 
                                    <View style={{ width: "70%" }}>
                                        <FlatList horizontal 
                                            data={metadata.supported_nips}
                                            renderItem={item => (
                                                <Text style={styles.nip}>{item.item}</Text>
                                            )}
                                            showsHorizontalScrollIndicator={false}
                                        />
                                    </View> 
                                </View>
                            }
                        </SectionContainer>
                    </View>
                    </>
                }
            </ScrollView>  

            <View style={styles.buttonArea}>
                <ButtonDefault label={useTranslate("commons.remove")} onPress={handleDelete} />
                <ButtonDefault 
                    label={connected ? "Disconect" : "Connect"} 
                    onPress={connected ? handleDisconect : handleConnect}
                    loading={connecting}
                />
            </View>
            <MessageBox />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { backgroundColor: theme.colors.black, height: "100%" },
    title: { textAlign: "center", fontWeight: "500", color: theme.colors.white, fontSize: 20 },
    description: { color: theme.colors.gray, textAlign: "center", paddingVertical: 10 },
    buttonArea: { position: "absolute", bottom: 35, justifyContent: "center",
        width: "100%", flexDirection: "row" },

    section: { width: "100%", alignItems: "center", marginVertical: 10 },
    sectionContainer: { width: "98%", backgroundColor: theme.colors.blueOpacity },
    sectionLine: { width: "100%", padding: 10, marginVertical: 4, flexDirection: "row" },
    nip: { padding: 10, paddingVertical: 6, color: theme.colors.black, 
        backgroundColor: theme.colors.white, borderRadius: 10, margin: 2 }
})

export default RelayScreen
