const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path')
/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
    resolver: {
        sourceExts: ['tsx', 'ts', 'js', 'jsx', 'json'], // Certifique-se de incluir as extensões do TypeScript.
        alias: {
            '@': path.resolve(__dirname, './'), // Adicione o alias para o caminho correto.
            '@assets': path.resolve(__dirname, './assets'), // Adicione o alias para o caminho correto.
            '@src': path.resolve(__dirname, './src'), // Adicione o alias para o caminho correto.
            '@screens': path.resolve(__dirname, './src/screens'), // Adicione o alias para o caminho correto.
            '@services': path.resolve(__dirname, './src/services'), // Adicione o alias para o caminho correto.
            '@components': path.resolve(__dirname, 'src/components'), // Adicione o alias para o caminho correto.
        },
    }, 
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
