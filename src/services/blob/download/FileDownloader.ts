import { pushMessage } from "../../notification";
import { getGaleryPermission } from "../../permissions";
import { useTranslate } from "../../translate";
import { DownloadProps, IDownloadService } from "./IDownloadService";
import { CameraRoll } from "@react-native-camera-roll/camera-roll"
import * as FileSystem from "react-native-fs"

export class FileDownloader implements IDownloadService 
{
    public async download({ 
        url, setDownloading, setDownloadProgress 
    }: DownloadProps) : Promise<void>
    {
        if(!(await getGaleryPermission())) return

        if(setDownloading) setDownloading(true)
        if(setDownloadProgress) setDownloadProgress(0)
    
        const fileName = url.substring(url.lastIndexOf("/"))
        const filePath = `${FileSystem.ExternalDirectoryPath}${fileName}`

        await FileSystem.downloadFile({
            fromUrl: url,
            toFile: filePath,
            progress: (res) => {
                if(setDownloadProgress) {
                    let percentage = (res.bytesWritten / res.contentLength) * 100
                    setDownloadProgress(percentage)
                }
            }
        }).promise.then(() => {
            if(setDownloading) setDownloading(true)
            if(setDownloadProgress) setDownloadProgress(0)
            CameraRoll.saveAsset(filePath, { type: "auto", album: process.env.APP_NAME })
            useTranslate("message.download.successfully").then(pushMessage)
        }).catch(() => { 
            if(setDownloading) setDownloading(false)
            if(setDownloadProgress) setDownloadProgress(0)
            useTranslate("message.default_error").then(pushMessage)
        })
    }
}
