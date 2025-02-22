import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, FAB } from "react-native-paper";
import useMatches from "./hooks/useMatches";
import { FlatList } from "react-native-gesture-handler";
import MatchCard from "../../components/matches/MatchCard";
import MyCustomBottomSheet from "../../components/shared/MyCustomBottomSheet";
import { CreateMatchForm } from "../../components/matches/CreateMatchForm";
import CreatePlaceForm from "../../components/matches/CreatePlaceForm";

export const MatchesScreen = () => {
  const {
    getMatches,

    createMatch,
    matches,

    newMatchBottomSheet,
    newPlaceBottomSheet,
    matchDetailsBottomSheet,
    joinMatchBottomSheet,
    openBottomSheet,

    isLoading,
  } = useMatches();

  return (
    <View style={styles.mainView}>
      <FlatList
        data={matches}
        keyExtractor={(item, index) => String(index)}
        renderItem={({ item }) => <MatchCard match={item} showDetails={()=>{openBottomSheet(matchDetailsBottomSheet)}}  joinMatch={()=>{openBottomSheet(joinMatchBottomSheet)}} />}
        onRefresh={getMatches}
        refreshing={isLoading}
      />


      <View style={styles.fabContainer}>
        <FAB
          icon="plus"
          onPress={() => openBottomSheet(newMatchBottomSheet)}
          style={styles.fab}
        />
        <FAB
          icon="map-marker"
          onPress={() => openBottomSheet(newPlaceBottomSheet)}
          style={styles.fab}
        />
      </View>


      {/* Create a match  */}
      <MyCustomBottomSheet ref={newMatchBottomSheet} snapPoints={['10%', '75%']}>
        <View>
          <CreateMatchForm />
        </View>
      </MyCustomBottomSheet>


      {/* Crete a place  */}
      <MyCustomBottomSheet ref={newPlaceBottomSheet} snapPoints={['10%', '75%']}>
        <View>
          <CreatePlaceForm />
        </View>
      </MyCustomBottomSheet>

      {/* Match details */}
      <MyCustomBottomSheet ref={matchDetailsBottomSheet} snapPoints={['10%', '75%']}>
        <View>
          <Text>Details</Text>
        </View>
      </MyCustomBottomSheet>

      {/* Join match */}
      <MyCustomBottomSheet ref={joinMatchBottomSheet} snapPoints={['10%', '75%']}>
        <View>
          <Text>Join match</Text>
        </View>
      </MyCustomBottomSheet>

    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: "#FFF",
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  fabContainer: {
    position: "absolute",
    right: 16,
    bottom: 16,
    alignItems: "flex-end",
    gap: 16,
  },
  fab: {

  },
});