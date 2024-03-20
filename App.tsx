import 'react-native-gesture-handler';

import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import AppRoutes from './src/routes'; 
import theme from './src/theme';

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: theme.COLORS.BLACK }} >
        <StatusBar hidden translucent />
        <AppRoutes />
    </View>
  );
}
