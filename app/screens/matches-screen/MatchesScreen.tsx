import React, { useEffect, useState } from "react";
import { View, StyleSheet, Platform, KeyboardAvoidingView } from "react-native";
import { Text, FAB, TextInput, PaperProvider } from "react-native-paper";
import useMatches from "./hooks/useMatches";
import { FlatList, Pressable, ScrollView } from "react-native-gesture-handler";
import MatchCard from "../../components/matches/MatchCard";
import MyCustomBottomSheet from "../../components/shared/MyCustomBottomSheet";
import { useNavigation } from "@react-navigation/native";
import { MyLoadingButton } from "../../components/shared/MyLoadingButton";
import { Dropdown } from "react-native-paper-dropdown";
import { RootStackParamList } from "../../navigation/home-stack.navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import DateTimePicker from '@react-native-community/datetimepicker';

type HomeStackNavigationProp = StackNavigationProp<RootStackParamList, 'PlaceScreen'>;

export const MatchesScreen = () => {
  const navigation = useNavigation<HomeStackNavigationProp>();

  const {
    getMatches,
    createMatch,
    matches,
    newMatchBottomSheet,
    matchDetailsBottomSheet,
    joinMatchBottomSheet,
    openBottomSheet,
    isLoadingRefresh,
    selectedMatch,
    setSelectedMatch,
    optionsPlaces,
    newMatchData,
    setNewMatchData,

    ticketsAmount,
    setTicketsAmount
  } = useMatches();

  // Estados para los pickers
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const [selectedPlace, setSelectedPlace] = useState<string>();

  const onCloseSheet = () =>{
    setTicketsAmount(0)
  }

  // Función para manejar la selección del día
  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(Platform.OS === 'ios'); // En iOS, el picker no se cierra automáticamente
    if (selectedDate) {
      // Actualizamos startTime y endTime con la nueva fecha, manteniendo las horas existentes
      const newStartTime = new Date(selectedDate);
      newStartTime.setHours(
        newMatchData.startTime?.getHours() || 0,
        newMatchData.startTime?.getMinutes() || 0
      );

      const newEndTime = new Date(selectedDate);
      newEndTime.setHours(
        newMatchData.endTime?.getHours() || 0,
        newMatchData.endTime?.getMinutes() || 0
      );

      setNewMatchData((prevState) => ({
        ...prevState,
        startTime: newStartTime,
        endTime: newEndTime,
      }));
    }
  };

  // Función para manejar la selección de la hora de inicio
  const handleStartTimeChange = (event: any, selectedTime: Date | undefined) => {
    setShowStartTimePicker(Platform.OS === 'ios'); // En iOS, el picker no se cierra automáticamente
    if (selectedTime) {
      // Combinamos la fecha actual de startTime con la nueva hora
      const newStartTime = new Date(newMatchData.startTime || new Date());
      newStartTime.setHours(selectedTime.getHours(), selectedTime.getMinutes());

      setNewMatchData((prevState) => ({
        ...prevState,
        startTime: newStartTime,
      }));
    }
  };

  // Función para manejar la selección de la hora de fin
  const handleEndTimeChange = (event: any, selectedTime: Date | undefined) => {
    setShowEndTimePicker(Platform.OS === 'ios'); // En iOS, el picker no se cierra automáticamente
    if (selectedTime) {
      // Combinamos la fecha actual de endTime con la nueva hora
      const newEndTime = new Date(newMatchData.endTime || new Date());
      newEndTime.setHours(selectedTime.getHours(), selectedTime.getMinutes());

      setNewMatchData((prevState) => ({
        ...prevState,
        endTime: newEndTime,
      }));
    }
  };

  // Formatear la fecha y hora para mostrarlas en los inputs
  const formattedDate = newMatchData.startTime
    ? newMatchData.startTime.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    : "";

  const formattedStartTime = newMatchData.startTime
    ? newMatchData.startTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
    : "";

  const formattedEndTime = newMatchData.endTime
    ? newMatchData.endTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
    : "";

  useEffect(() => {

  }, [matches])


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
        refreshing={isLoadingRefresh}
      />

      <View style={styles.fabContainer}>
        <FAB icon="plus" onPress={() => openBottomSheet(newMatchBottomSheet)} />
        <FAB
          icon="map-marker"
          onPress={() => navigation.navigate("PlaceScreen")}
        />
      </View>

      {/* Modal para crear un partido */}
      <MyCustomBottomSheet ref={newMatchBottomSheet} snapPoints={["50%", "95%"]}>
        <PaperProvider>
          <Text style={styles.modalTitleMargin} variant="headlineSmall">
            Create match
          </Text>

          <ScrollView>
            {/* Selector de fecha */}
            <Pressable onPress={() => setShowDatePicker(true)}>
              <View pointerEvents="none">
                <TextInput
                  mode="outlined"
                  label="Date"
                  value={formattedDate}
                  editable={false}

                />
              </View>
            </Pressable>

            {showDatePicker && (
              <DateTimePicker
                mode="date"
                display="spinner"
                value={newMatchData.startTime || new Date()}
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}

            {/* Selector de hora de inicio */}
            <Pressable onPress={() => setShowStartTimePicker(true)}>
              <View pointerEvents="none">
                <TextInput
                  mode="outlined"
                  label="Start time"
                  value={formattedStartTime}
                  editable={false}
                />
              </View>
            </Pressable>

            {showStartTimePicker && (
              <DateTimePicker
                mode="time"
                display="spinner"
                value={newMatchData.startTime || new Date()}
                onChange={handleStartTimeChange}
              />
            )}

            {/* Selector de hora de fin */}
            <Pressable onPress={() => setShowEndTimePicker(true)}>
              <View pointerEvents="none">
                <TextInput
                  mode="outlined"
                  label="End time"
                  value={formattedEndTime}
                  editable={false}
                />
              </View>
            </Pressable>

            {showEndTimePicker && (
              <DateTimePicker
                mode="time"
                display="spinner"
                value={newMatchData.endTime || new Date()}
                onChange={handleEndTimeChange}
              />
            )}

            {/* Dropdown para seleccionar el lugar */}
            <Dropdown
              label="Place"
              mode="outlined"
              options={optionsPlaces}
              onSelect={(value) => {
                setSelectedPlace(value);
                setNewMatchData((prevState) => ({
                  ...prevState,
                  placeId: value ? parseInt(value) : 0,
                }));
              }}
              value={selectedPlace}
            />

            {/* Input para la capacidad de personas */}
            <TextInput
              onChangeText={(text) => {
                setNewMatchData((prevState) => ({
                  ...prevState,
                  peopleCapacity: text ? parseInt(text) : 0,
                }));
              }}
              mode="outlined"
              label="People capacity"
              inputMode="numeric"
              value={newMatchData.peopleCapacity.toString()} // Vinculado al estado
            />

            {/* Input para el nombre del equipo local */}
            <TextInput
              onChangeText={(text) => {
                setNewMatchData((prevState) => ({
                  ...prevState,
                  localName: text,
                }));
              }}
              mode="outlined"
              label="Local name"
              value={newMatchData.localName} // Vinculado al estado
            />

            {/* Input para el nombre del equipo visitante */}
            <TextInput
              onChangeText={(text) => {
                setNewMatchData((prevState) => ({
                  ...prevState,
                  visitorName: text,
                }));
              }}
              mode="outlined"
              label="Visitor name"
              value={newMatchData.visitorName} // Vinculado al estado
            />

            {/* Input para el costo de entrada */}
            <TextInput
              onChangeText={(text) => {
                setNewMatchData((prevState) => ({
                  ...prevState,
                  entryCost: text ? parseInt(text) : 0,
                }));
              }}
              mode="outlined"
              label="Entry cost"
              inputMode="numeric"
              value={newMatchData.entryCost.toString()} // Vinculado al estado
            />
          </ScrollView>

          {/* Botón para crear el partido */}
          <MyLoadingButton label="Create" onPress={createMatch} />
        </PaperProvider>
      </MyCustomBottomSheet>

      {/* Modal para detalles del partido */}
      <MyCustomBottomSheet ref={matchDetailsBottomSheet} snapPoints={["10%", "75%"]}>
        <View>
          <Text style={styles.modalTitleMargin} variant="headlineSmall">
            Details
          </Text>
        </View>
      </MyCustomBottomSheet>

      {/* Modal para unirse a un partido */}
      <MyCustomBottomSheet onCloseSheet={onCloseSheet}  ref={joinMatchBottomSheet} snapPoints={["10%", "50%"]}>
        <View>


          <Text style={styles.modalTitleMargin} variant="headlineSmall">
            {selectedMatch ? selectedMatch.localName : ''}
            {""} vs {""}
            {selectedMatch ? selectedMatch.visitorName : ''}
          </Text>

          <TextInput
            style={{ marginVertical: 10 }}
            keyboardType="numeric"
            mode="outlined"
            label="Tickets"
            value={ticketsAmount.toString()}
            onChangeText={(value) => {
              if (selectedMatch) {
                let selectedTickets = value ? parseInt(value) : 0;
                const availableTickets = selectedMatch?.peopleCapacity - selectedMatch?.registeredPeople;


                if (availableTickets < selectedTickets) {
                  selectedTickets = availableTickets;
                }

                setTicketsAmount(selectedTickets);
              }
            }}
          />


          <Text variant="bodyLarge">
            Available tickets:{" "}
            {selectedMatch ? (selectedMatch?.peopleCapacity - selectedMatch?.registeredPeople) : ''}
          </Text>

          <Text variant="bodyLarge">
            Ticket cost:{" "}
            {selectedMatch ? (selectedMatch?.entryCost) : ''}
          </Text>

          <Text variant="bodyLarge">
            Total $:{" "}
            {selectedMatch ? (parseInt(selectedMatch?.entryCost) * ticketsAmount) : ''}
          </Text>
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
    textAlign: "center",
  },
});