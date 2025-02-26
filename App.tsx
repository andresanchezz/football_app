import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { StripeProvider } from '@stripe/stripe-react-native'

import React from 'react'

import KickoffStackNavigation from './app/navigation/kickoff-stack.navigation'

import Toast from 'react-native-toast-message';

import 'react-native-get-random-values';

export default function App() {

  const publiShableKey = 'pk_test_51QHoTo2KiubiiDPbOSnRAWNvx95B5kv4RwILRDLObEGrhyLnKujmh2zw4CCQnI6yZGeZpyday1iM1zbrjlpOfJyE00h6M6XRgi';

  return (

    <SafeAreaView style={{ flex: 1 }}>
      <StripeProvider publishableKey={publiShableKey}>
        <NavigationContainer>
          <KickoffStackNavigation />
        </NavigationContainer>
      </StripeProvider>
      <Toast />
    </SafeAreaView>

  )
}
