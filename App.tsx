import 'react-native-gesture-handler';

import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import AppRoutes from './src/routes';
import theme from '@src/theme';
import { useEffect, useState } from 'react';
import { getUser } from './src/services/memory';
import SplashScreen from './src/components/general/SplashScreen';
import { createPairKeys } from './src/services/nostr/core';

export default function App() {

    const [loading, setLoading] = useState(false)
    const [logged, setLogged] = useState(false)

    useEffect(() => {

        createPairKeys()

        const {publicKey} = getUser()
        
        if(publicKey)
            setLogged(true)

        setLoading(false)
    }, [])

    if(loading)
        return <SplashScreen />

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.black }} >
            <StatusBar hidden translucent />
            <AppRoutes logged={logged} />
        </View>
    );
}
