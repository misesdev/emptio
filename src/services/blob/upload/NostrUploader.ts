import NDK, { NDKEvent } from "@nostr-dev-kit/ndk-mobile";
import { UploadProps, UploadService } from "./IUploadService";
import { AppResponse, trackException } from "../../telemetry";
import { TimeSeconds } from "@services/converter/TimeSeconds";
import { Image, Video } from "react-native-compressor"
import { UploadServer } from "@storage/servers/types";
import { bytesToHex, sha256 } from "bitcoin-tx-lib";
import useNDKStore from "@services/zustand/useNDKStore";
import { User } from "@services/user/types/User";
import * as FileSystem from "react-native-fs"
import axios from "axios"

type Nip96Event = {
    tags: [string[]]
}

// implementation of nip96 upload 
// https://github.com/nostr-protocol/nips/blob/master/96.md
export class NostrUploader implements UploadService
{
    private readonly _user: User;
    private readonly _server: UploadServer;
    private readonly _ndk: NDK;
    constructor(
        user: User,
        server: UploadServer,
        ndk: NDK = useNDKStore.getState().ndk
    ) {
        this._ndk = ndk
        this._server = server
        this._user = user
    }

    public async upload({ localUri, mimeType }: UploadProps): Promise<AppResponse<string>> 
    {
        try {
            let compressedUri = localUri
            if(mimeType.includes("image")) {
                compressedUri = await Image.compress(localUri, { 
                    compressionMethod: "auto",
                    quality: .5
                })
            } else if (mimeType.includes("video")) {
                compressedUri = await Video.compress(localUri, {
                    compressionMethod: "auto"
                })
            }
            const base64 = await FileSystem.readFile(compressedUri, "base64")
            const bytes = this.bytesFromBase64(base64)
            if(bytes.length >= 10000000)
                throw new Error("Very large file to upload")
            const hash = bytesToHex(sha256(bytes))
            const token = await this.generateJwt(hash);
            const form = new FormData()
            form.append("file", {
                uri: compressedUri,
                type: mimeType,
                name: `${hash}.${mimeType.split("/")[1]}`,
            })
            form.append("size", bytes.length.toString())
            form.append("content_type", mimeType)
            form.append("expiration", "")
            const response = await axios.post(this._server.url, form, {
                headers: {
                    'Authorization': token,
                    'Content-Type': "multipart/form-data"
                },
            });
            if(response.data.status == "success")
            {
                const event = response.data.nip94_event as Nip96Event
                const tagUrl = event.tags.find(t => t[0] == "url")
                if(tagUrl) 
                    return { success: true, data: tagUrl[1] }
            }
            return { success: false }
        } catch(ex) {
            return trackException(ex)
        }
    }

    private async generateJwt(hash: string): Promise<string> 
    {
        const event = new NDKEvent(this._ndk, {
            kind: 27235,
            pubkey: this._user.pubkey,
            created_at: (TimeSeconds.now()+60),
            tags: [
                ["u", this._server.url],
                ["method", "POST"],
                ["payload", hash]
            ],
            content: ""
        })
        await event.sign()
        const nevent = event.rawEvent()
        const row = JSON.stringify(nevent)
        const jwt = Buffer.from(row).toString('base64');
        return `Nostr ${jwt}`;
    }

    private bytesFromBase64(base64: string): Uint8Array {
        const binaryStr = atob(base64)
        const bytes = new Uint8Array(binaryStr.length)
        for (let i = 0; i < binaryStr.length; i++) {
            bytes[i] = binaryStr.charCodeAt(i)
        }
        return bytes
    }
}
