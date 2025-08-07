import { FileDownloader } from "./download/FileDownloader"
import { NostrUploader } from "./upload/NostrUploader"
import { UploadProps } from "./upload/IUploadService"
import { DownloadProps } from "./download/IDownloadService"
import { User } from "../user/types/User"
import { UploadServer } from "@storage/servers/types"
import { AppResponse } from "../telemetry"

class BlobService 
{
    private readonly _uploader: NostrUploader 
    private readonly _downloader: FileDownloader

    constructor(user: User, server: UploadServer) 
    {
        this._downloader = new FileDownloader()
        this._uploader = new NostrUploader(user, server)
    }

    public async download(props: DownloadProps) 
    {
        await this._downloader.download(props)
    }

    public async upload(props: UploadProps): Promise<AppResponse<string>> 
    {
        return this._uploader.upload(props)
    }
}

export default BlobService
