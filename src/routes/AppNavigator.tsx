import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from '@components/general/SplashScreen';
import { useAuth } from '../context/AuthContext';
import AppProviders from './AppProviders';
import AuthStack from './AuthStack';
import AppStack from './AppStack';

const AppNavigator = () => {
    const { loading, isLoggedIn } = useAuth();

    if(isLoggedIn && !loading) 
    {
        return (
            <AppProviders>
                <NavigationContainer>
                    <AppStack />
                </NavigationContainer>
            </AppProviders>
        )
    }

    if(loading) return <SplashScreen />

    return (
        <NavigationContainer>
            <AuthStack />
        </NavigationContainer>
    )
}

export default AppNavigator
