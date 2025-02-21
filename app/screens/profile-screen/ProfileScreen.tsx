import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import useProfile from "./hooks/useProfile.hook";
import { Avatar } from "react-native-paper";




export const ProfileScreen = () => {

  const { handleSignOut } = useProfile();

  return (
    <View style={styles.mainView} >
     
    <Avatar.Icon icon="account" size={135}></Avatar.Icon>

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
    paddingVertical: 20,
    paddingHorizontal: 5
  }
})

