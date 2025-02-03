import { useEffect, useState } from "react"
import { View, Image, StyleSheet, Dimensions } from "react-native"
import LinkError from "./LinkError"

type ScreenProps = { url: string }
const ImagePreview = ({ url }: ScreenProps) => {
   
    const { width, height } = Dimensions.get("window")
    const [error, setError] = useState<boolean>(false)
    const [imageWidth, setImageWidth] = useState<number>(200)
    const [imageHeight, setImageHeight] = useState<number>(200)

    useEffect(() => {
        try {
            Image.getSize(url, (sourceWidth, sourceHeight) => {
                const scaleFactor = (width - 100) / sourceWidth
                //const scaleFactorHeight = (height - 300) / sourceHeight
                //setImageHeight(sourceWidth * scaleFactor)
                
                //setImageHeight(sourceHeight * scaleFactor)
            })
        } catch { }
    }, [])

    if(error) 
        return <LinkError url={url} />

    return (
        <View style={[styles.image, { height: imageHeight }]}>
            <Image 
                onError={() => setError(true)} 
                source={{ uri: url }} style={{ flex: 1 }} 
            />
        </View>
    )
}

const styles = StyleSheet.create({
    image: {         
        width: "98%",
        marginVertical: 10,
        resizeMode: "cover",
        borderRadius: 10,
        overflow: "hidden"
    }
})

export default ImagePreview
