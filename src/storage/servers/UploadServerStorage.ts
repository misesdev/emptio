import { BaseStorage } from "../base/BaseStorage";
import { UploadServer } from "./types";

class UploadServerStorage extends BaseStorage<UploadServer>
{
    constructor() {
        super("blossom-servers", [
            { name: "nostr.build", url: "https://nostr.build/api/v2/nip96/upload" },
            { name: "nostrcheck.me", url: "https://cdn.nostrcheck.me" },
            { name: "nostr.download", url: "https://nostr.download/n96" },
            { name: "nostpic.com", url: "https://nostpic.com/api/v2/media" },
        ])
    }
}

export default UploadServerStorage
