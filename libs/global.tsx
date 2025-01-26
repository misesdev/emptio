//import { TextEncoder, TextDecoder } from "text-encoding"
import { MessageChannel, MessagePort } from "./channel"
import { Buffer } from "buffer"

Object.assign(global, {
    TextEncoder,
    TextDecoder,
    MessageChannel,
    MessagePort,
    Buffer
})    
