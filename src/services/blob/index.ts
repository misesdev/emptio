import { NDKEvent } from "@nostr-dev-kit/ndk-mobile"
import axios from "axios"
import * as FileSystem from "react-native-fs"
import { getGaleryPermission } from "../permissions"
import { CameraRoll } from "@react-native-camera-roll/camera-roll"
import { pushMessage } from "../notification"
import { useTranslate } from "../translate"

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

interface DownloadProps {
    url: string,
    setDownloading?: (state: boolean) => void,
}
interface DownVideoProps extends DownloadProps {
    setDownloadProgress: (state: number) => void
}

const downloadVideo = async ({ url, setDownloading, setDownloadProgress  }: DownVideoProps) => {

    if(!(await getGaleryPermission())) return

    if(setDownloading) setDownloading(true)
    setDownloadProgress(0)

    const fileName = url.substring(url.lastIndexOf("/"))
    const filePath = `${FileSystem.ExternalDirectoryPath}${fileName}`

    await FileSystem.downloadFile({
        fromUrl: url,
        toFile: filePath,
        progress: (res) => {
            let percentage = (res.bytesWritten / res.contentLength) * 100
            setDownloadProgress(percentage)
        }
    }).promise.then(() => {
        if(setDownloading) setDownloading(true)
        setDownloadProgress(0)
        CameraRoll.saveAsset(filePath, { type: "video", album: process.env.APP_NAME })
        useTranslate("message.download.successfully").then(pushMessage)
    }).catch(() => { 
        if(setDownloading) setDownloading(false)
        setDownloadProgress(0)
        useTranslate("message.default_error").then(pushMessage)
    })
}
const downloadImage = async ({ url, setDownloading }: DownloadProps) => {

    if(!(await getGaleryPermission())) return

    if(setDownloading) setDownloading(true)
    const fileName = url.substring(url.lastIndexOf("/"))
    const filePath = `${FileSystem.ExternalDirectoryPath}${fileName}`
    await FileSystem.downloadFile({
        fromUrl: url,
        toFile: filePath,
    }).promise.then(() => {
        if(setDownloading) setDownloading(false)
        CameraRoll.saveAsset(filePath, { type: "photo", album: process.env.APP_NAME })
        useTranslate("message.download.successfully").then(pushMessage)
    }).catch(() => { 
        if(setDownloading) setDownloading(false)
        useTranslate("message.default_error").then(pushMessage)
    })
}

export const blobService = {
    downloadVideo,
    downloadImage
}
