import * as SecureStore from 'expo-secure-store';
import { useAuthStore, useStateStore, useUserDataStore } from '../../../state';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootParamList } from '../../../navigation/kickoff-stack.navigation';
import { useEffect, useRef, useState } from 'react';
import { Match, NewMatch } from '../../../interfaces/matches/match';
import { apiServices } from '../../../api/services-qps';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import moment from 'moment';
import { Place } from '../../../interfaces/place/place';
import { Purchase } from '../../../interfaces/matches/purchase';

interface Options {
    label: string,
    value: string
}

const useMatches = () => {

    const { user } = useUserDataStore();

    const { setIsLoading } = useStateStore();

    const [isLoadingRefresh, setIsLoadingRefresh] = useState<boolean>(false);

    const [matches, setMatches] = useState<Match[]>();
    /* const [places, setPlaces] = useState<Place[]>(); */
    const [optionsPlaces, setOptionsPlaces] = useState<Options[]>([]);

    const [selectedMatch, setSelectedMatch] = useState<Match>();
    const [ticketsAmount, setTicketsAmount] = useState<number>(0);

    const [newMatchData, setNewMatchData] = useState<NewMatch>({
        peopleCapacity: 0,
        endTime: new Date(),
        startTime: new Date(),
        entryCost: 0,
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
            setIsLoadingRefresh(true)
            const { data } = await apiServices.get<Match[]>('/match/matches');
            setMatches(data)

        } catch (error) {
            console.log('Error useMatches', error)
        } finally {
            setIsLoadingRefresh(true)
        }
    }

    const getPlaces = async () => {
        try {
            const { data } = await apiServices.get<Place[]>('/place/places');
            const placesOptions = data.map((place) => ({
                label: place.name,
                value: place.id.toString()
            }));
            setOptionsPlaces(placesOptions);
        } catch (error) {
            console.log('Error getplaces', error);
        }
    };

    const createMatch = async () => {

        if (
            newMatchData.peopleCapacity <= 0 ||
            newMatchData.localName.trim() === '' ||
            newMatchData.visitorName.trim() === '' ||
            newMatchData.placeId <= 0 ||
            !(newMatchData.startTime instanceof Date && !isNaN(newMatchData.startTime.getTime())) ||
            !(newMatchData.endTime instanceof Date && !isNaN(newMatchData.endTime.getTime())) ||
            newMatchData.entryCost <= 0
        ) {
            console.log(newMatchData)
            console.log('Error: Faltan datos o alguna propiedad está vacía.');
            return;
        }

        try {
            setIsLoading(true)
            const data = await apiServices.post('/match/addMatch', newMatchData);
            console.log(data.status)
            setNewMatchData({
                peopleCapacity: 0,
                localName: '',
                visitorName: '',
                placeId: 0,
                startTime: new Date(),
                endTime: new Date(),
                entryCost: 0
            });


            newMatchBottomSheet.current?.close();
            getMatches()
        } catch (error: any) {
            console.log('Error creando match', error?.response?.data);
        } finally {
            setIsLoading(false)
        }
    };

    const purchaseTickets = async () => {

        if (!selectedMatch || !user) {
            return
        }

        try {
            setIsLoading(true)
            const { data } = await apiServices.post<Purchase>('/match/purchase', {
                userId: user.id,
                matchId: selectedMatch.id,
                ticketsBought: ticketsAmount
            })
            joinMatchBottomSheet.current?.close();

            

        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }


    useEffect(() => {
        getMatches();
        getPlaces();
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
        isLoadingRefresh,

        selectedMatch,
        setSelectedMatch,

        optionsPlaces,
        newMatchData,
        setNewMatchData,

        ticketsAmount,
        setTicketsAmount,

        purchaseTickets

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
