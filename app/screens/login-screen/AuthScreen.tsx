import { KeyboardAvoidingView, Platform, ScrollView, Image, View, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { TextInput, Text, } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

import useAuthScreenHook from './hooks/useAuthScreen.hook';

import { RootParamList } from '../../navigation/kickoff-stack.navigation';
import { typography } from '../../../styles/typography';
import { buttonStyles } from '../../../styles/styles';
import { colors } from '../../../styles/colors';
import { MyLoadingButton } from '../../components/shared/MyLoadingButton';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useState } from 'react';



export type LoginScreenNavigationProp = StackNavigationProp<RootParamList, 'LoginScreen'>;

const AuthScreen = () => {

  const [isLogginIn, setIsLogginIn] = useState(false);

  const changeAuthMode = () => setIsLogginIn(!isLogginIn);

  const { email, setEmail, username, setUsername, password, setPassword, handleSignIn, handleSignUp } = useAuthScreenHook();

  return (

    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>

        <Image
          style={{ width: '100%', height: '30%' }}
          source={require('../../../assets/adaptive-icon.png')}
        />

        <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
          <Text style={{ textAlign: 'center', ...typography.headingLarge.black, color: colors.primary }}>
            Welcome
          </Text>
          <View>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              mode="outlined"
            />

            <View style={{ height: 25 }}></View>

            {
              isLogginIn &&
              <View>
                <TextInput
                  label="Name"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  mode="outlined"
                />

                <View style={{ height: 25 }}></View>
              </View>
            }

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              mode="outlined"
            />
          </View>


          <View>
            <MyLoadingButton label={!isLogginIn ? 'Sign in' : 'Sign up'} onPress={
              !isLogginIn ? handleSignIn : handleSignUp
            } />

            <TouchableWithoutFeedback onPress={changeAuthMode}>
              <Text style={{ textAlign: 'center' }}>
                {!isLogginIn ? 'Create Account' : 'Already have an account'}
              </Text>
            </TouchableWithoutFeedback>
          </View>


        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </KeyboardAvoidingView>
  );
}

export default AuthScreen

