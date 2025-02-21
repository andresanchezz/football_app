import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '../../../state';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootParamList } from '../../../navigation/kickoff-stack.navigation';

type NavigationProp = StackNavigationProp<RootParamList, 'LoginScreen'>;

const useProfile = () => {

    const store = useAuthStore();
    const { user } = useAuthStore();

    const handleSignOut = async () => {
        store.signOut();
    }

    return {
        handleSignOut,
        user
    }

}

export default useProfile;
