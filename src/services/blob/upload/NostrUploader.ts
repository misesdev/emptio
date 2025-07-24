import { NDKEvent } from "@nostr-dev-kit/ndk-mobile";
import { UploadProps, UploadService } from "./IUploadService";
import * as FileSystem from "react-native-fs"
import { timeSeconds } from "@services/converter";
import NostrPairKey from "../../nostr/pairkey/NostrPairKey";
import { bytesToHex } from "bitcoin-tx-lib";
import axios from "axios"

export class NostrUploader implements UploadService
{
    public async upload({ 
        localUri, mimeType, destination, privateKey 
    }: UploadProps): Promise<string> 
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

    private async generateJwt(privateKey: Uint8Array): Promise<string> 
    {
        const pairkey = new NostrPairKey(privateKey)
        const pubkey = pairkey.getPublicKey();
        const createdAt = timeSeconds.now() 
        const expiration = createdAt + 60;

        const event = new NDKEvent();
        event.kind = 24242;
        event.pubkey = bytesToHex(pubkey);
        event.created_at = createdAt;
        event.tags = [
            ['expiration', expiration.toString()],
            ['method', 'put'],
            ['t', 'media'],
            ['u', 'https://nostr.download/media'],
        ];

        const signedEvent = await pairkey.signEvent(event)
        const raw = signedEvent.rawEvent();
        const jwt = Buffer.from(JSON.stringify(raw)).toString('base64');
        return `Nostr ${jwt}`;
    }
}
