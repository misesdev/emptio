import axios from "axios"
import * as FileSystem from "expo-file-system"

export const uploadImage = async (uri: string) => {

    const imageInfo = await FileSystem.getInfoAsync(uri)
    const imageBlob = await FileSystem.readAsStringAsync(imageInfo.uri, { encoding: FileSystem.EncodingType.Base64 })

    const form = new FormData()

    const imageObject = {
        uri: imageInfo.uri,
        blob: imageBlob,
    };
    form.append("img_uri", imageInfo.uri)
    form.append("fileToUpload", JSON.stringify(imageObject))
    form.append("submit", "Upload Media")

    const response = await axios.post("https://nostr.build/upload.php", form, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })

    if (response.status == 200) {
        var string = response.data.toString()
        if (string.includes("media_container"))
            console.log("Upload realizado: ", string.substring(string.indexOf("media_container"), 500))
        else
            console.log("Não feito Upload!")

        console.log(response.data)
    }

    console.log(imageInfo.uri)
}

