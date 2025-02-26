import { createStackNavigator } from '@react-navigation/stack'

import HomeTabNavigation from './home-tab.navigation'
import PlaceScreen from '../screens/place-screen/PlaceScreen'


export type RootStackParamList = {
    HomeTabNavigation: undefined; 
    PlaceScreen: undefined; 
  };
  

const Stack = createStackNavigator<RootStackParamList>();

const HomeStackNavigation = () => {
    return (
        <Stack.Navigator initialRouteName="HomeTabNavigation"
            >
            <Stack.Screen options={{headerShown: false}} name="HomeTabNavigation" component={HomeTabNavigation} />
            <Stack.Screen name="PlaceScreen" component={PlaceScreen} />
        </Stack.Navigator>
    )
}

export default HomeStackNavigation;
