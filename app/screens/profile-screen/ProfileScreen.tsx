import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import useProfile from "./hooks/useProfile.hook";
import { Avatar, Text } from "react-native-paper";
import { useUserDataStore } from "../../state";




export const ProfileScreen = () => {

  const { handleSignOut } = useProfile();
  const { user } = useUserDataStore();

  return (

    <View style={styles.mainView} >

      <Avatar.Icon icon="account" size={150}></Avatar.Icon>
      <View style={styles.userInfo} >
        <Text>{user?.name}</Text>
        <Text style={styles.namePadding}>{user?.role}</Text>
        <Text>{user?.email}</Text>
      </View>



      <TouchableOpacity onPress={handleSignOut}>
        <Text>Log out</Text>
      </TouchableOpacity>

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

