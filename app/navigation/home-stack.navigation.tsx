import { createStackNavigator } from '@react-navigation/stack'

import HomeTabNavigation from './home-tab.navigation'
import PlaceScreen from '../screens/place-screen/PlaceScreen'
import { Platform } from 'react-native';



export type RootStackParamList = {
    HomeTabNavigation: undefined;
    PlaceScreen: undefined;
    HistoryScreen: undefined;
};


const Stack = createStackNavigator<RootStackParamList>();

const HomeStackNavigation = () => {
    return (
        <Stack.Navigator initialRouteName="HomeTabNavigation"
        >
            <Stack.Screen options={{ headerShown: false }} name="HomeTabNavigation" component={HomeTabNavigation} />
            <Stack.Screen options={{
                  headerStyle: {
                    height: 60, 
                  },
                  headerTitleAlign: 'center', 
                  headerStatusBarHeight: 0
                
            }} name="PlaceScreen" component={PlaceScreen} />
        </Stack.Navigator>
    )
}

export default HomeStackNavigation;
