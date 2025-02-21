import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from "../../styles/colors";

import { ProfileScreen } from '../screens/profile-screen/ProfileScreen';
import { MatchesScreen } from '../screens/matches-screen/MatchesScreen';




const Tab = createBottomTabNavigator();

const HomeTabNavigation = () => {


    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ size }) => {
                    const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
                        MatchesScreen: "football-outline",
                        ProfileScreen: "person-circle-outline",
                    };
                    return <Ionicons name={icons[route.name]} color={colors.primary} size={size} />;
                },
            })}
        >
            <Tab.Screen options={{
                headerTitleAlign: 'center',
                title: 'Matches',
            }} name="MatchesScreen" component={MatchesScreen} />

            <Tab.Screen options={{
                title: "Profile",
                headerTitleAlign: 'center'
            }} name="ProfileScreen" component={ProfileScreen} />
        </Tab.Navigator>
    )
};

export default HomeTabNavigation;
