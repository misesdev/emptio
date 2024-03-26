const TextEncodingPolyfill = require("text-encoding")
import { MessageChannel, MessagePort } from "./channel"

export const applyGlobalPolyfills = () => {
    Object.assign(global, {
        TextEncoder: TextEncodingPolyfill.TextEncoder,
        TextDecoder: TextEncodingPolyfill.TextDecoder,
        MessageChannel,
        MessagePort
    })
}

