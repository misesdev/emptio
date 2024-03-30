const { TextEncoder, TextDecoder } = require("text-encoding")
import { MessageChannel, MessagePort } from "./channel"
const { Buffer } = require("buffer")

Object.assign(global, {
    TextEncoder,
    TextDecoder,
    MessageChannel,
    MessagePort,
    Buffer
})    
