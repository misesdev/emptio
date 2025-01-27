import axios from "axios"
import * as FileSystem from "react-native-fs"

export const uploadImage = async (localUri: string) => {

    const imageBlob = await FileSystem.readFile(localUri)

    // const form = new FormData()

    // const imageObject = {
    //     uri: imageInfo.uri,
    //     blob: imageBlob,
    // };
    // form.append("img_uri", imageInfo.uri)
    // form.append("fileToUpload", JSON.stringify(imageObject))
    // form.append("submit", "Upload Media")

    // const response = await axios.post("https://nostr.build/upload.php", form, {
    //     headers: {
    //         'Content-Type': 'multipart/form-data',
    //     },
    // })

}

