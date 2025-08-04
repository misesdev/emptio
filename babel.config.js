module.exports = {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
        ['module:react-native-dotenv'],
        ['react-native-reanimated/plugin'],
        [
            'module-resolver',
            {
                root: ['./src'],
                extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
                alias: {
                    '@': '.',
                    '@assets': './assets',
                    '@src': './src',
                    '@components': './src/components',
                    '@screens': './src/screens',
                    '@services': './src/services',
                    '@storage': './src/storage'
                },
            },
        ]
    ],
}
