import theme from "@/src/theme"
import { getLinkPreview } from "link-preview-js"
import { useEffect, useState } from "react"
import { StyleSheet, Text, View, Image, Linking, TouchableOpacity } from "react-native"
import { ActivityIndicator } from "react-native-paper"
import LinkError from "./LinkError"

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

    useEffect(() => { loadPreviewData() }, [])

    const loadPreviewData = async () => {
        try {
            const metadata:any = await getLinkPreview(link)
                
            if(!metadata?.images?.length) 
                setNotPreview(true)
            
            setLoading(false)

            setData(metadata)
        } catch { 
            setNotPreview(true)
            setLoading(false)
        }
    }

    if(notPreview) 
        return <LinkError url={link} /> 

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
