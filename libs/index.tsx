const TextEncodingPolyfill = require("text-encoding")

export const applyGlobalPolyfills = () => {
    Object.assign(global, {
        TextEncoder: TextEncodingPolyfill.TextEncoder,
        TextDecoder: TextEncodingPolyfill.TextDecoder,
    })
}
