import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '../../../state';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootParamList } from '../../../navigation/kickoff-stack.navigation';
import { useEffect, useRef, useState } from 'react';
import { Match, NewMatch } from '../../../interfaces/matches/match';
import { apiServices } from '../../../api/services-qps';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import moment from 'moment';


const useMatches = () => {


    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [matches, setMatches] = useState<Match[]>();
    const [selectedMatch, setSelectedMatch] = useState<Match>();


    const [newMatchData, setNewMatchData] = useState<NewMatch>({
        peopleCapacity: 0,
        endTime: new Date(),
        startTime: new Date(),
        entryCost: 20,
        localName: '',
        visitorName: '',
        placeId: 0
    });

    const newPlaceBottomSheet = useRef<BottomSheetMethods>(null);
    const newMatchBottomSheet = useRef<BottomSheetMethods>(null);
    const matchDetailsBottomSheet = useRef<BottomSheetMethods>(null);
    const joinMatchBottomSheet = useRef<BottomSheetMethods>(null);

    const openBottomSheet = (bottomSheetRef: React.RefObject<BottomSheetMethods>) => {
        bottomSheetRef.current?.expand();
    };

    const getMatches = async () => {
        try {
            setIsLoading(true)
            const { data } = await apiServices.get<Match[]>('/match/matches');

            setMatches(data)

        } catch (error) {
            console.log('Error useMatches', error)
        } finally {
            setIsLoading(true)
        }
    }

    const createMatch = async () => {

        const newMatch: NewMatch = {
            peopleCapacity: newMatchData?.peopleCapacity,
            localName: newMatchData.localName,
            visitorName: newMatchData.visitorName,
            placeId: newMatchData.placeId,
            startTime: newMatchData.startTime,
            endTime: newMatchData.endTime,
            entryCost: 0
        }

        try {

            const { data } = await apiServices.post('/match/addMatch', { data: newMatch })
            console.log(data)

        } catch (error) {
            console.log('Error creando match', error)
        }

    }

    useEffect(() => {
        getMatches();
    }, [])


    return {
        getMatches,

        createMatch,
        matches,

        newPlaceBottomSheet,
        newMatchBottomSheet,
        matchDetailsBottomSheet,
        joinMatchBottomSheet,
        openBottomSheet,
        isLoading,

        selectedMatch,
        setSelectedMatch

    }

}

export default useMatches;



/* const store = useAuthStore();
const { user } = useAuthStore();

const handleSignOut = async () => {
    store.signOut();
}

return {
    handleSignOut,
    user
} */
