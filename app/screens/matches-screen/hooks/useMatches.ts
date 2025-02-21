import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '../../../state';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootParamList } from '../../../navigation/kickoff-stack.navigation';
import { useState } from 'react';
import { Match } from '../../../interfaces/matches/match';
import { apiServices } from '../../../api/services-qps';


const useMatches = () => {

    const [matches, setMatches] = useState<Match[]>();

    const getMatches = () =>{

        apiServices.get<Match>('.../')

    }

    /* const store = useAuthStore();
    const { user } = useAuthStore();

    const handleSignOut = async () => {
        store.signOut();
    }

    return {
        handleSignOut,
        user
    } */

        return {
            getMatches
        }

}

export default useMatches;
