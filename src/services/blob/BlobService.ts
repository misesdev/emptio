import { FileDownloader } from "./download/FileDownloader"
import { NostrUploader } from "./upload/NostrUploader"
import { UploadProps } from "./upload/IUploadService"
import { DownloadProps } from "./download/IDownloadService"
import { User } from "../user/types/User"

class BlobService 
{
    private readonly _uploader: NostrUploader 
    private readonly _downloader: FileDownloader

    constructor(user: User) 
    {
        this._uploader = new NostrUploader(user)
        this._downloader = new FileDownloader()
    }

    public async download(props: DownloadProps) 
    {
        await this._downloader.download(props)
    }

    public async upload(props: UploadProps) 
    {
        return this._uploader.upload(props)
    }
}

export default BlobService
