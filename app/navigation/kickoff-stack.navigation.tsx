import { createStackNavigator } from '@react-navigation/stack'

import { useAuthStore, useHomeStore } from '../state'

import HomeStackNavigation from './home-stack.navigation'
import AuthScreen from '../screens/login-screen/AuthScreen'
import SplashScreen from '../screens/splash-screen/SplashScreen'

export type RootParamList = {
    SplashScreen: undefined;
    LoginScreen: undefined;
    HomeStackNavigation: undefined;
}

const Stack = createStackNavigator()

const KickoffStackNavigation = () => {

    const { isLoading } = useHomeStore();
    const { token } = useAuthStore();

    return (
        <Stack.Navigator initialRouteName="SplashScreen"
            screenOptions={{
                headerShown: false,
            }}>
            {
                isLoading
                    ? (<Stack.Screen name="SplashScreen" component={SplashScreen} />)
                    : token == ""
                        ? (<Stack.Screen name="LoginScreen" component={AuthScreen} />)
                        : (<Stack.Screen name="HomeStackNavigation" component={HomeStackNavigation} />)
            }
        </Stack.Navigator>
    )
}

export default KickoffStackNavigation;
