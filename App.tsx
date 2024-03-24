import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import theme from '@src/theme';
import { useEffect, useState } from 'react';
import SplashScreen from '@components/general/SplashScreen';
import Authenticate from '@screens/initialize';

export default function App() {

    const [loading, setLoading] = useState(false)

    useEffect(() => {

        setLoading(false)
    }, [])

    if (loading)
        return <SplashScreen />

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.black }} >
            <StatusBar hidden translucent />
            <Authenticate />
        </View>
    );
}
