
export type UploadProps = {
    localUri: string;
    mimeType: string;
    destination: string;
    privateKey?: Uint8Array;
}

export interface UploadService {
    upload(props: UploadProps): Promise<string>;
}
