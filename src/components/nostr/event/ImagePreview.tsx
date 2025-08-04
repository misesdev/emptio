import { useEffect, useState } from "react"
import { View, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native"
import { useService } from "@/src/providers/ServiceProvider"
import Ionicons from 'react-native-vector-icons/Ionicons'
import LinkError from "./LinkError"
import theme from "@src/theme"

interface ScreenProps { url: string, redute?: number }

const ImagePreview = ({ url, redute=180 }: ScreenProps) => {
 
    const { downloader } = useService()
    const { width } = Dimensions.get("window")
    const [error, setError] = useState<boolean>(false)
    const [imageHeight, setImageHeight] = useState<number>(200)
    const [downloading, setDownloading] = useState<boolean>(false)

    useEffect(() => {
        try {
            Image.getSize(url, (sourceWidth, sourceHeight) => {
                setImageHeight(((width-redute) * sourceHeight) / sourceWidth)
            })
        } catch { }
    }, [])

    const handleDownload = async() => {
        downloader.download({
            url,
            setDownloading
        })
    }

    if(error) 
        return <LinkError url={url} />

    return (
        <View style={[styles.image, { height: imageHeight }]}
        >
            <Image onError={() => setError(true)} 
                source={{ uri: url }} style={{ flex: 1 }} 
            />
            <View style={styles.controlsHeader}>
                {!downloading &&
                    <TouchableOpacity style={styles.controlsHeaderButton}
                        onPress={handleDownload}
                    >
                        <Ionicons name={"cloud-download"} size={18} color={theme.colors.white} />
                    </TouchableOpacity>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    image: { width: "100%", marginVertical: 10, resizeMode: "contain", borderRadius: 10,
        overflow: "hidden" },
    controlsHeader: { width: "100%", position: "absolute", top: 0, flexDirection: "row-reverse", 
        backgroundColor: theme.colors.transparent },
    controlsHeaderButton: { padding: 4, borderRadius: 10, margin: 4,
        backgroundColor: theme.colors.blueOpacity },
})

export default ImagePreview
