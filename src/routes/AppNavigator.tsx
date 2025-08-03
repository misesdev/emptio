import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { AccountProvider } from '../context/AccountContext';
import { ServiceProvider } from '../providers/ServiceProvider';
import AuthStack from './AuthStack';
import AppStack from './AppStack';

const AppNavigator = () => {
    const { isLoggedIn } = useAuth();

    if(isLoggedIn) {
        return (
            <AccountProvider>
                <ServiceProvider>
                    <NavigationContainer>
                        <AppStack />
                    </NavigationContainer>
                </ServiceProvider>
            </AccountProvider>
        )
    }

    return (
        <NavigationContainer>
            <AuthStack />
        </NavigationContainer>
    )
}

export default AppNavigator
