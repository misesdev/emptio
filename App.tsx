import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import AppRoutes from './src/routes'; 

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: 'transparent' }} >
        <StatusBar hidden translucent />
        <AppRoutes />
    </View>
  );
}
