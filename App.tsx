import "react-native-reanimated"
import "react-native-gesture-handler"
import "react-native-get-random-values"

import { enableScreens } from "react-native-screens";
enableScreens()

import "./libs/global"

import React from 'react';
import { StyleSheet, View } from 'react-native'
import { TranslateProvider } from './src/providers/translateProvider';
import { AuthProvider } from "./src/providers/userProvider";
import AppNavigator from "./src/routes/AppNavigator";
import theme from './src/theme';

export default function App(): React.JSX.Element {
    return (
        <View style={styles.root}>
            <TranslateProvider>
                <AuthProvider>
                    <AppNavigator />
                </AuthProvider>
            </TranslateProvider>
        </View>
    )
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.colors.black }
})


