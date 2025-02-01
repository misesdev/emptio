import theme from "@/src/theme"
import { getLinkPreview } from "link-preview-js"
import { useEffect, useState } from "react"
import { StyleSheet, Text, View, Image, Linking, TouchableOpacity } from "react-native"
import { ButtonLink } from "../../form/Buttons"
import { ActivityIndicator } from "react-native-paper"

type MetadadaLink = {
    url?: string,
    title?: string,
    description?: string,
    images?: string[]
}
type Props = {
    link: string
}

const clipText = (text: string, size = 32) => {
    if(text.length > size) return `${text.substring(0,size)}...`
    return text
}

const LinkPreview = ({ link }: Props) => {

    const [data, setData] = useState<MetadadaLink>({})
    const [loading, setLoading] = useState<boolean>(true)
    const [notPreview, setNotPreview] = useState<boolean>(false)

    useEffect(() => {
        try {
            getLinkPreview(link).then((metadata: any) => {
                setData(metadata)
                if(!metadata?.images?.length) 
                    setNotPreview(true)
                setLoading(false)
            })
        } catch { 
            setNotPreview(true)
            setLoading(false)
        }
    }, [])

    if(notPreview) 
        return (
            <View style={{ position: "relative", width: "100%", padding: 10 }}>
                <ButtonLink 
                    label={link} 
                    style={{ marginVertical: 0 }}
                    color={theme.colors.blue} 
                    onPress={() => Linking.openURL(link)}
                />
            </View>
        )

    if(loading)
        return (
            <View style={{ width: "100%", alignItems: "center" }}>
                <ActivityIndicator color={theme.colors.blue} size={20} />
            </View>
        )

    return (
        <TouchableOpacity activeOpacity={.7} onPress={() => Linking.openURL(link)} style={styles.webContainer}>
            {data?.images?.length && 
                <Image style={styles.imageView} source={{ uri: data.images[0] }}  />
            }
            <View style={styles.subSection}>
                <Text style={styles.domain}>{clipText(data?.url ?? "")}</Text>
                <Text style={styles.title}>{clipText(data?.title ?? "", 36)}</Text>
                <Text style={styles.description}>{clipText(data?.description ?? "", 60)}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    webContainer: { width: "98%", padding: 4, borderRadius: 10, overflow: "hidden", 
        backgroundColor: theme.colors.blueOpacity },
    imageView: { width: "100%", borderTopLeftRadius: 10, borderTopRightRadius: 10, height: 150 },
    subSection: { width: "100%", padding: 10 },
    domain: { color: theme.colors.gray, fontSize: 11 },
    title: { color: theme.colors.white },
    description: { color: theme.colors.gray, fontSize: 13 }
})

export default LinkPreview
