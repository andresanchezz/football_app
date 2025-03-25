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
            console.log('Error: Faltan datos o alguna propiedad está vacía.');
            return;
        }


        try {
            setIsLoading(true)

            const data = await apiServices.post('/match/addMatch', newMatchData);

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
