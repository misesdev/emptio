
export type DownloadProps = {
    url: string;
    setDownloading?: (state: boolean) => void,
    setDownloadProgress?: (state: number) => void
}

export interface IDownloadService {
    download(props: DownloadProps): Promise<void>
}
