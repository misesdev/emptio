import { NDKEvent, NDKPrivateKeySigner } from "@nostr-dev-kit/ndk-mobile";
import { UploadProps, UploadService } from "./IUploadService";
import * as FileSystem from "react-native-fs"
import axios from "axios"

export class NostrUploader implements UploadService
{
    public async upload({ localUri, mimeType, destination, privateKey }: UploadProps): Promise<string> 
    {
        if(!privateKey)
            throw new Error("Missing the privateKey parameter")

        const jwt = await this.generateJwt(privateKey);
        const data = await FileSystem.readFile(localUri, "base64")

        const res = await axios.put(destination, data, {
            headers: {
                'Authorization': jwt,
                'Content-Type': mimeType,
                'Accept': 'application/json',
            },
        });

        return res.data.url || res.data.location;
    }

    private async generateJwt(privateKey: string): Promise<string> 
    {
        const signer = new NDKPrivateKeySigner(privateKey);
        const pubkey = (await signer.user()).pubkey;
        const createdAt = Math.floor(Date.now() / 1000);
        const expiration = createdAt + 10;

        const event = new NDKEvent();
        event.kind = 24242;
        event.pubkey = pubkey;
        event.created_at = createdAt;
        event.tags = [
            ['expiration', expiration.toString()],
            ['method', 'put'],
            ['t', 'media'],
            ['u', 'https://nostr.download/media'],
        ];

        await event.sign(signer);
        const raw = event.rawEvent();
        const jwt = Buffer.from(JSON.stringify(raw)).toString('base64');
        return `Nostr ${jwt}`;
    }
}
