import { AppResponse } from "../../telemetry";

export type UploadProps = {
    localUri: string;
    mimeType: string;
}

export interface UploadService {
    upload(props: UploadProps): Promise<AppResponse<string>>;
}
