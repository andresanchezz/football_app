import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, FAB } from "react-native-paper";
import useMatches from "./hooks/useMatches";
import { FlatList } from "react-native-gesture-handler";
import MatchCard from "../../components/matches/MatchCard";
import MyCustomBottomSheet from "../../components/shared/MyCustomBottomSheet";
import { CreateMatchForm } from "../../components/matches/CreateMatchForm";
import { useNavigation } from "@react-navigation/native";
import { MatchDetails } from "../../components/matches/MatchDetails";
import { JoinMatch } from "../../components/matches/JoinMatch";

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
          style={styles.fab}
        />
      </View>

      {/* Modal para crear un partido */}
      <MyCustomBottomSheet ref={newMatchBottomSheet} snapPoints={["10%", "75%"]}>
        <View>
          <CreateMatchForm />
        </View>
      </MyCustomBottomSheet>

      {/* Modal para detalles del partido */}
      <MyCustomBottomSheet ref={matchDetailsBottomSheet} snapPoints={["10%", "75%"]}>
        <View>
          {selectedMatch && <MatchDetails match={selectedMatch} />}
        </View>
      </MyCustomBottomSheet>

      {/* Modal para unirse a un partido */}
      <MyCustomBottomSheet ref={joinMatchBottomSheet} snapPoints={["10%", "75%"]}>
        <View>
          {selectedMatch && <JoinMatch match={selectedMatch} />}
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
    // Estilos adicionales para el FAB si es necesario
  },
});