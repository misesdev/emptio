const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config')
const path = require('path')

const defaultConfig = getDefaultConfig(__dirname)

const config = {
    resolver: {
        sourceExts: ['tsx', 'ts', 'js', 'jsx', 'json'], 
        alias: {
            '@': path.resolve(__dirname, './'),
            '@assets': path.resolve(__dirname, './assets'), 
            '@src': path.resolve(__dirname, './src'), 
            '@screens': path.resolve(__dirname, './src/screens'), 
            '@services': path.resolve(__dirname, './src/services'), 
            '@components': path.resolve(__dirname, 'src/components'), 
        },
        blockList: [
            // /.*\/node_modules\/.*/,
            /.*\/__tests__\/.*/
        ]
    }
}

module.exports = mergeConfig(defaultConfig, config);
