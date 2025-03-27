import * as SecureStore from 'expo-secure-store';
import * as Sentry from "@sentry/react-native";
import Toast from 'react-native-toast-message';

import { apiServices } from '../../../api/services-qps';
import { useState } from 'react';
import { useAuthStore, useStateStore, useUserDataStore } from '../../../state';


const useAuthScreenHook = () => {

  enum roles {
    player = "player"
  }

  const { setToken } = useAuthStore();
  const { setIsLoading } = useStateStore();
  const { setUser } = useUserDataStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const checkFields = (fields: string[]) => {

    fields.map((field) => {

      if (field.trim() === "") {
        Toast.show({
          type: 'error',
          text1: 'Empty fields',
          text2: 'Please fill all fields',
        });
        return;
      }
    })

  }

  const handleSignIn = async () => {

    checkFields([email, password])

    try {
      setIsLoading(true)
      const { data: { accessToken, id } } = await apiServices.post<AuthResponse>('/auth/authenticate', {
        email,
        password,
      });

      await SecureStore.setItemAsync('userToken', accessToken);

      setToken(accessToken);
      console.log(accessToken);
      await getUserInfo(id);

      setIsLoading(true)


    } catch (error: any) {

      Toast.show({
        type: 'error',
        text1: error.response.data.error,
        text2: error.response.data.message
      })
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  };

  const handleSignUp = async () => {

    checkFields([email, name, password])
    
    setIsLoading(true)
    try {
      await apiServices.post<AuthResponse>('/auth/register', {
        email,
        password,
        name,
        role: roles.player
      });

      handleSignIn()

    } catch (error) {

    } finally {
      setIsLoading(false)
    }
  }

  const getUserInfo = async (userId: number) => {
    try {

      const { data } = await apiServices.get(`/user/infouser/${userId}`)

      SecureStore.setItem('userData', JSON.stringify(data));

    } catch (error) {
      console.log('Error getuserinfo', error)
    }
  }

  return {
    handleSignIn,
    email,
    username: name,
    password,
    setEmail,
    setPassword,
    setUsername: setName,
    handleSignUp
  }
}

export default useAuthScreenHook