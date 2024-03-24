import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import theme from '@src/theme';
import AppRoutes from './src/routes';

export default function App() {
    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.black }} >
            <StatusBar hidden translucent />
            <AppRoutes />
        </View>
    );
}
