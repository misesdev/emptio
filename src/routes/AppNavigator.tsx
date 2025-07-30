import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import AppStack from './AppStack';
import AuthStack from './AuthStack';

const AppNavigator = () => {
    const { isLoggedIn } = useAuth();

    return (
        <NavigationContainer>
            {isLoggedIn ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    )
}

export default AppNavigator
