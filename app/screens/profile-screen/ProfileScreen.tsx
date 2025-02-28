import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import useProfile from "./hooks/useProfile.hook";
import { Avatar, Text } from "react-native-paper";
import { useUserDataStore } from "../../state";
import { MyLoadingButton } from "../../components/shared/MyLoadingButton";

import * as secureStore from 'expo-secure-store';



export const ProfileScreen = () => {

  const { handleSignOut } = useProfile();

  const userString = secureStore.getItem('userData');
  const user = userString ? JSON.parse(userString) : null;


  return (

    <View style={styles.mainView} >

      <Avatar.Icon icon="account" size={150}></Avatar.Icon>
      <View style={styles.userInfo} >
        <Text>{user?.name}</Text>
        <Text style={styles.namePadding}>{user?.role}</Text>
        <Text>{user?.email}</Text>
      </View>



      <View style={{ width: '100%' }}>
        <MyLoadingButton label="Sign out" onPress={handleSignOut} />
      </View>

    </View>

  )
};

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: "#FFF",
    flex: 1,
    paddingVertical: 30,
    paddingHorizontal: 5,
    alignItems: 'center'
  },
  userInfo: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    margin: 30
  },

  namePadding: {
    marginVertical: 20,
    textTransform: 'uppercase'
  }

})

