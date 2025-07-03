
export type UploadProps = {
    localUri: string;
    mimeType: string;
    destination: string;
    privateKey?: string;
}

export interface UploadService {
    upload(props: UploadProps): Promise<string>;
}
