import React, { useEffect, useRef, useState } from 'react';

import * as secureStorage from 'expo-secure-store';

import { apiServices } from '../../../api/services-qps';
import { Match, MatchAdapted, MatchAdapter } from '../../../interfaces/matches/match';
import { InfoUser } from '../../../interfaces/user/info-user';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

export const useHistory = () => {

    const qrBotomSheetRef = useRef<BottomSheetMethods>(null)

    const userString = secureStorage.getItem('userData');
    const user: InfoUser = userString ? JSON.parse(userString) : null

    const [userMatches, setUserMatches] = useState<MatchAdapted[]>([]);
    const [qrValue, setQrValue] = useState<string>();

    const getUserMatches = async () => {
        try {
            const { data } = await apiServices.get<Match[]>(`/user/matchs/${user?.id}`);
            const adaptedData = data.map(MatchAdapter.fromExternalToInternal)
            setUserMatches(adaptedData)
        } catch (error) {
            console.log(error)
        }
    }



    const generateQr = async (match: MatchAdapted) => {

        try {
            const { data } = await apiServices.get(`/user/uuid/${user.id}/${match.id}`);
            console.log(data)
        } catch (error: any) {
            console.log(error)
        }

         openQrBottomSheet(); 
    }

    const openQrBottomSheet = () => {

        qrBotomSheetRef.current?.expand()
    }

    useEffect(() => {
        getUserMatches();
    }, [])


    return {
        userMatches,
        qrBotomSheetRef,
        generateQr,
        qrValue,
        setQrValue
    }


}
