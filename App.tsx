import "react-native-reanimated"
import "react-native-gesture-handler"
import "react-native-get-random-values"

import { enableScreens } from "react-native-screens";
enableScreens()

import "./libs/global"

import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native'
import { TranslateProvider } from './src/providers/translateProvider';
import { SettingsProvider } from './src/providers/settingsProvider';
import { AuthProvider } from './src/providers/userProvider';
import AppRoutes from './src/routes';
import theme from './src/theme';

export default function App(): React.JSX.Element {
    
    return (
        <View style={styles.root}>
            <StatusBar backgroundColor={theme.colors.black} />
            <TranslateProvider>
                <SettingsProvider>
                    <AuthProvider>
                        <AppRoutes />
                    </AuthProvider>
                </SettingsProvider>
            </TranslateProvider>
        </View>
    )
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.colors.black }
})


