import * as SecureStore from 'expo-secure-store';
import { useStateStore } from '../../../state';

import { useEffect, useRef, useState } from 'react';
import { Match, MatchAdapted, MatchAdapter } from '../../../interfaces/matches/match';
import { apiServices } from '../../../api/services-qps';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

import { Place } from '../../../interfaces/place/place';
import { Purchase } from '../../../interfaces/matches/purchase';
import { useStripe } from '@stripe/stripe-react-native';
import Toast from 'react-native-toast-message';



interface Options {
    label: string,
    value: string
}

const useMatches = () => {

    const userString = SecureStore.getItem('userData');
    const user = userString ? JSON.parse(userString) : null;

    const { initPaymentSheet, presentPaymentSheet } = useStripe();

    const { setIsLoading } = useStateStore();

    const [isLoadingRefresh, setIsLoadingRefresh] = useState<boolean>(false);

    const [matches, setMatches] = useState<MatchAdapted[]>();

    const [optionsPlaces, setOptionsPlaces] = useState<Options[]>([]);

    const [selectedMatch, setSelectedMatch] = useState<MatchAdapted>();
    const [ticketsAmount, setTicketsAmount] = useState<number>(0);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState<string>();

    const [newMatchData, setNewMatchData] = useState({
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
            const adaptedMatches = data.map(MatchAdapter.fromExternalToInternal);
            setMatches(adaptedMatches)
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

    const validateMatchData = (matchData: typeof newMatchData): { isValid: boolean; errorMessage?: string } => {
        // Validar campos requeridos
        if (matchData.localName.trim() === '') {
            return { isValid: false, errorMessage: 'Local team name is required' };
        }

        if (matchData.visitorName.trim() === '') {
            return { isValid: false, errorMessage: 'Visitor team name is required' };
        }

        if (matchData.placeId <= 0) {
            return { isValid: false, errorMessage: 'Please select a valid place' };
        }

        // Validar fechas
        if (!(matchData.startTime instanceof Date) || isNaN(matchData.startTime.getTime())) {
            return { isValid: false, errorMessage: 'Invalid start time' };
        }

        if (!(matchData.endTime instanceof Date) || isNaN(matchData.endTime.getTime())) {
            return { isValid: false, errorMessage: 'Invalid end time' };
        }

        if (matchData.endTime <= matchData.startTime) {
            return { isValid: false, errorMessage: 'End time must be after start time' };
        }

        // Validar números positivos
        if (matchData.peopleCapacity <= 0) {
            return { isValid: false, errorMessage: 'People capacity must be greater than 0' };
        }

        if (matchData.entryCost <= 0) {
            return { isValid: false, errorMessage: 'Entry cost must be greater than 0' };
        }

        return { isValid: true };
    };

    const createMatch = async () => {
        const validation = validateMatchData(newMatchData);
        if (!validation.isValid) {
            Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: validation.errorMessage || 'Please check your input data',
            });
            return;
        }

        try {
            setIsLoading(true);

            await apiServices.post('/match/addMatch', newMatchData);

            Toast.show({
                type: 'success',
                text1: 'Match created',
            });

            setShowDatePicker(false)
            setShowStartTimePicker(false)
            setShowEndTimePicker(false)
            setSelectedPlace('');

            setNewMatchData({
                peopleCapacity: 0,
                localName: '',
                visitorName: '',
                placeId: 0,
                startTime: new Date(),
                endTime: new Date(),
                entryCost: 0
            });

            // Cerrar modal y refrescar lista
            newMatchBottomSheet.current?.close();
            getMatches();

            // Mostrar éxito
            Toast.show({
                type: 'success',
                text1: 'Match created',
                text2: 'Your match has been successfully created',
                visibilityTime: 2000,
            });

        } catch (error: any) {
            console.log('Error creating match', error?.response?.data);
            Toast.show({
                type: 'error',
                text1: 'Server error',
                text2: error.response?.data?.message || 'Failed to create match',
                visibilityTime: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    //*Payment

    const purchaseTickets = async () => {
        // Verifica si hay un partido seleccionado y un usuario autenticado
        if (!selectedMatch || !user) {
            console.error("No se ha seleccionado un partido o el usuario no está autenticado.");
            return;
        }

        try {
            setIsLoading(true);

            const { data } = await apiServices.post<Purchase>('/match/purchase', {
                userId: user.id,
                matchId: selectedMatch.id,
                ticketsBought: ticketsAmount
            });

            joinMatchBottomSheet.current?.close();

            setTimeout(async () => {
                await paymentSheet(data);

                confirmPreauthorization(data.paymentIntentId)

            }, 1000);




        } catch (error) {
            console.error("Error durante la compra de boletos:", error);
            Toast.show({
                text1: 'Error',
                text2: 'Hubo un problema al procesar tu compra. Por favor, intenta de nuevo.',
            });
        } finally {
            setIsLoading(false);
        }
    }

    const paymentSheet = async (paymentData: Purchase) => {
        try {

            await initPaymentSheet({
                merchantDisplayName: 'Nombre del Comercio',
                paymentIntentClientSecret: paymentData.paymentIntentKey
            });


            await presentPaymentSheet();

        } catch (error: any) {
            console.error("Error durante el proceso de pago:", error);
            Toast.show({
                text1: 'Error',
                text2: 'Hubo un problema al procesar tu pago. Por favor, intenta de nuevo.',
            });
        }
    }

    const confirmPreauthorization = async (preAuthorizationId: string) => {
        console.log(preAuthorizationId)
        try {
            const { data } = await apiServices.post('/match/confirmPreauthorization', { preAuthorizationId });

        } catch (error: any) {
            console.log('error en confirm authorization')
        }
    }


    //* Scan QR */



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

        purchaseTickets,

        showDatePicker,
        showStartTimePicker,
        showEndTimePicker,
        selectedPlace,

        setShowDatePicker,
        setShowStartTimePicker,
        setShowEndTimePicker,
        setSelectedPlace,

        getPlaces

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
