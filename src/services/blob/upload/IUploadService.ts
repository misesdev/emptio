
export type UploadProps = {
    localUri: string;
    mimeType: string;
    destination: string;
}

export interface UploadService {
    upload(props: UploadProps): Promise<string>;
}
