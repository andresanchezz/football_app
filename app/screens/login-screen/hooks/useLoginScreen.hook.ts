import * as SecureStore from 'expo-secure-store';
import * as Sentry from "@sentry/react-native";
import Toast from 'react-native-toast-message';

import { apiServices } from '../../../api/services-qps';
import { useState } from 'react';
import { useAuthStore, useStateStore, useUserDataStore } from '../../../state';


const useLoginScreenHook = () => {

  const { setToken } = useAuthStore();
  const { setIsLoading } = useStateStore();
  const { setUser } = useUserDataStore();
  const [username, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleLogin = async () => {


    if (!username || !password) {
      Toast.show({
        type: 'error',
        text1: 'Campos vacíos',
        text2: 'Por favor llene ambos campos',
      });
      return;
    }

    try {
      setIsLoading(true)
      const { data: { accessToken, id } } = await apiServices.post<AuthResponse>('/auth/authenticate', {
        email: username,
        password: password,
      });

      await SecureStore.setItemAsync('userToken', accessToken);

      setToken(accessToken);

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

  const getUserInfo = async (userId: number) => {
    try {
      const { data } = await apiServices.get(`/user/infouser/${userId}`)
      setUser(data)
      console.log(data)
    } catch (error) {
      console.log('Error getuserinfo', error)
    }
  }

  return {
    handleLogin,
    username,
    password,
    setEmail,
    setPassword,
  }
}

export default useLoginScreenHook