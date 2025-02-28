import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '../../../state';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootParamList } from '../../../navigation/kickoff-stack.navigation';

type NavigationProp = StackNavigationProp<RootParamList, 'LoginScreen'>;

const useProfile = () => {

    const store = useAuthStore();

    const handleSignOut = async () => {
        store.signOut();
        SecureStore.deleteItemAsync('userData')
    }

    return {
        handleSignOut,
    }

}

export default useProfile;
