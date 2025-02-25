import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, FAB, TextInput } from "react-native-paper";
import useMatches from "./hooks/useMatches";
import { FlatList } from "react-native-gesture-handler";
import MatchCard from "../../components/matches/MatchCard";
import MyCustomBottomSheet from "../../components/shared/MyCustomBottomSheet";
import { useNavigation } from "@react-navigation/native";
import { MyLoadingButton } from "../../components/shared/MyLoadingButton";
import { Dropdown } from "react-native-paper-dropdown";

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
    selectedMatch,
    setSelectedMatch,
  } = useMatches();

  const navigation = useNavigation();

  return (
    <View style={styles.mainView}>
      <FlatList
        data={matches}
        keyExtractor={(item, index) => String(index)}
        renderItem={({ item }) => (
          <MatchCard
            match={item}
            showDetails={() => {
              setSelectedMatch({ ...item });
              openBottomSheet(matchDetailsBottomSheet);
            }}
            joinMatch={() => {
              setSelectedMatch({ ...item });
              openBottomSheet(joinMatchBottomSheet);
            }}
          />
        )}
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
          onPress={() => navigation.navigate("PlaceScreen")}
        />
      </View>

      {/* Modal para crear un partido */}
      <MyCustomBottomSheet ref={newMatchBottomSheet} snapPoints={["50%", "85%"]}>
        <View>
          <View>

            <Text style={styles.modalTitleMargin} variant="headlineSmall">Create match</Text>


            <TextInput mode='outlined' label="People capacity" inputMode='numeric'></TextInput>
            <TextInput mode='outlined' label="Local name"></TextInput>
            <TextInput mode='outlined' label="Local visitor" ></TextInput>
            <TextInput mode='outlined' label="Entry cost" inputMode='numeric'></TextInput>


            <TextInput mode='outlined' label="Date start" ></TextInput>
            <TextInput mode='outlined' label="Date finished" ></TextInput>

            <Dropdown
              label="Place"
              mode='outlined'
              options={[
              ]}
            />

            <MyLoadingButton label="Create" onPress={() => { }} />

          </View>
        </View>
      </MyCustomBottomSheet>

      {/* Modal para detalles del partido */}
      <MyCustomBottomSheet ref={matchDetailsBottomSheet} snapPoints={["10%", "75%"]}>
        <View>
          <Text style={styles.modalTitleMargin} variant="headlineSmall">Details</Text>
        </View>
      </MyCustomBottomSheet>

      {/* Modal para unirse a un partido */}
      <MyCustomBottomSheet ref={joinMatchBottomSheet} snapPoints={["10%", "75%"]}>
        <View>
          <Text style={styles.modalTitleMargin} variant="headlineSmall">Join</Text>

          <MyLoadingButton label="Join match" onPress={() => { }} />

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
  modalTitleMargin: {
    marginBottom: 10,
    textAlign: 'center'
  }

});