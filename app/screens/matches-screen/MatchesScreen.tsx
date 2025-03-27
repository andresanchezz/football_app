import React, { useCallback, useState } from "react";
import {
  View,
  StyleSheet,
  Platform,
  Alert,
  Linking,
  ActivityIndicator,
} from "react-native";
import { Text, FAB, TextInput } from "react-native-paper";
import { FlatList, Pressable, ScrollView } from "react-native-gesture-handler";
import { CameraView, useCameraPermissions } from "expo-camera";
import Toast from "react-native-toast-message";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

// Import your custom components and hooks here
import MatchCard from "../../components/matches/MatchCard";
import MyCustomBottomSheet from "../../components/shared/MyCustomBottomSheet";
import { MyLoadingButton } from "../../components/shared/MyLoadingButton";
import { Dropdown } from "react-native-paper-dropdown";
import { colors } from "../../../styles/colors";
import { apiServices } from "../../api/services-qps";
import { RootStackParamList } from "../../navigation/home-stack.navigation";
import useMatches from "./hooks/useMatches";


type HomeStackNavigationProp = StackNavigationProp<RootStackParamList, "PlaceScreen">;

export const MatchesScreen = () => {
  const navigation = useNavigation<HomeStackNavigationProp>();
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const [isScanning, setIsScanning] = useState(false);

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

    showDatePicker,
    showStartTimePicker,
    showEndTimePicker,
    selectedPlace,

    setShowDatePicker,
    setShowStartTimePicker,
    setShowEndTimePicker,
    setSelectedPlace,

    ticketsAmount,
    setTicketsAmount,

    purchaseTickets,
    getPlaces

  } = useMatches();

  useFocusEffect(
    useCallback(() => {
      getMatches();
      getPlaces();
    }, [])
  );

  const handleQRPress = async () => {
    if (permission?.granted) {
      setShowCamera(true);
      return;
    }

    const { granted, canAskAgain } = await requestPermission();

    if (granted) {
      setShowCamera(true);
    } else {
      if (!canAskAgain) {
        Alert.alert(
          "Camera Permission Required",
          "To scan QR codes, we need access to your camera. Please enable camera permissions in Settings.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => Linking.openSettings(),
            },
          ]
        );
      } else {
        Alert.alert(
          "Permission Denied",
          "Camera permission is required to scan QR codes. Please allow camera access when prompted."
        );
      }
    }
  };

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (isScanning) return;
    setIsScanning(true);
    try {
      await apiServices.post("/match/confirmAssist", JSON.parse(data));
      Toast.show({
        type: "success",
        text1: "Attendance Confirmed",
        text2: "Your match attendance has been successfully confirmed",
      });
      setShowCamera(false);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.message || "Failed to confirm attendance",
      });
    }finally{
      setIsScanning(false);
    }
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
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

      setNewMatchData((prevState: any) => ({
        ...prevState,
        startTime: newStartTime,
        endTime: newEndTime,
      }));
    }
  };

  const handleStartTimeChange = (event: any, selectedTime: Date | undefined) => {
    setShowStartTimePicker(Platform.OS === 'ios');
    if (selectedTime) {

      const newStartTime = new Date(newMatchData.startTime || new Date());
      newStartTime.setHours(selectedTime.getHours(), selectedTime.getMinutes());

      setNewMatchData((prevState: any) => ({
        ...prevState,
        startTime: newStartTime,
      }));
    }
  };

  const handleEndTimeChange = (event: any, selectedTime: Date | undefined) => {
    setShowEndTimePicker(Platform.OS === 'ios');
    if (selectedTime) {

      const newEndTime = new Date(newMatchData.endTime || new Date());
      newEndTime.setHours(selectedTime.getHours(), selectedTime.getMinutes());

      setNewMatchData((prevState: any) => ({
        ...prevState,
        endTime: newEndTime,
      }));
    }
  };

  const renderCameraView = () => (
    <View style={StyleSheet.absoluteFill}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        onBarcodeScanned={isCameraReady ? handleBarcodeScanned : undefined}
        onCameraReady={() => setIsCameraReady(true)}
      />
      {!isCameraReady && (
        <View style={styles.cameraLoading}>
          <ActivityIndicator size="large" /* color={colors.white} */ />
        </View>
      )}
      <FAB
        style={styles.closeCameraFab}
        icon="close"
        onPress={() => setShowCamera(false)}
      /*  color={colors.white} */
      />
    </View>
  );

  const renderCreateMatchForm = () => {
    // Formatos de fecha y hora (los que ya tenías en tu código)
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

    return (
      <ScrollView
        contentContainerStyle={styles.formContainer}
        keyboardShouldPersistTaps="handled"
      >


        {/* Selector de fecha */}
        <Pressable onPress={() => setShowDatePicker(true)}>
          <View pointerEvents="none">
            <TextInput
              mode="outlined"
              label="Date"
              value={formattedDate}
              editable={false}
              style={styles.inputSpacing}
            />
          </View>
        </Pressable>

        {showDatePicker && (
          <DateTimePicker
            mode="date"
            display={Platform.OS === "ios" ? "inline" : "default"}
            value={newMatchData.startTime || new Date()}
            onChange={handleDateChange}
            minimumDate={new Date()}
            themeVariant="light"
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
              style={styles.inputSpacing}
            />
          </View>
        </Pressable>

        {showStartTimePicker && (
          <DateTimePicker
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            value={newMatchData.startTime || new Date()}
            onChange={handleStartTimeChange}
            themeVariant="light"
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
              style={styles.inputSpacing}
            />
          </View>
        </Pressable>

        {showEndTimePicker && (
          <DateTimePicker
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            value={newMatchData.endTime || new Date()}
            onChange={handleEndTimeChange}
            themeVariant="light"
          />
        )}



        {/* Place Dropdown */}
        <Dropdown
          label="Place"
          mode="outlined"
          options={optionsPlaces}
          onSelect={(value) => {
            setSelectedPlace(value);
            setNewMatchData((prevState: any) => ({
              ...prevState,
              placeId: value ? parseInt(value) : 0,
            }));
          }}
          value={selectedPlace}
        />

        <View style={styles.inputSpacing}></View>

        {/* People Capacity */}
        <TextInput
          style={styles.inputSpacing}
          onChangeText={(text) => {
            setNewMatchData((prevState: any) => ({
              ...prevState,
              peopleCapacity: text ? parseInt(text) : 0,
            }));
          }}
          mode="outlined"
          label="People Capacity"
          inputMode="numeric"
          keyboardType="number-pad"
          value={newMatchData.peopleCapacity.toString()}
        />

        {/* Local Team Name */}
        <TextInput
          style={styles.inputSpacing}
          onChangeText={(text) => {
            setNewMatchData((prevState: any) => ({
              ...prevState,
              localName: text,
            }));
          }}
          mode="outlined"
          label="Local Team Name"
          value={newMatchData.localName}
        />

        {/* Visitor Team Name */}
        <TextInput
          style={styles.inputSpacing}
          onChangeText={(text) => {
            setNewMatchData((prevState: any) => ({
              ...prevState,
              visitorName: text,
            }));
          }}
          mode="outlined"
          label="Visitor Team Name"
          value={newMatchData.visitorName}
        />

        {/* Entry Cost */}
        <TextInput
          style={styles.inputSpacing}
          onChangeText={(text) => {
            setNewMatchData((prevState: any) => ({
              ...prevState,
              entryCost: text ? parseInt(text) * 100 : 0,
            }));
          }}
          mode="outlined"
          label="Entry Cost ($)"
          inputMode="decimal"
          keyboardType="decimal-pad"
          left={<TextInput.Affix text="$" />}
          value={(newMatchData.entryCost / 100).toString()}
        />
      </ScrollView>
    );
  };

  return (
    <View style={styles.mainView}>
      {showCamera ? (
        renderCameraView()
      ) : (
        <>
          <FlatList
            data={matches}
            keyExtractor={(item) => String(item.id)}
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
            contentContainerStyle={styles.listContent}
          />

          <View style={styles.fabContainer}>
            <FAB icon="qrcode" onPress={handleQRPress} />
            <FAB
              icon="plus"
              onPress={() => openBottomSheet(newMatchBottomSheet)}
            />
            <FAB
              icon="map-marker"
              onPress={() => navigation.navigate("PlaceScreen")}
            />
          </View>

          <MyCustomBottomSheet
            ref={newMatchBottomSheet}
            snapPoints={["50%", "90%"]}
            header={
              <Text style={styles.modalTitle} variant="headlineSmall">
                Create New Match
              </Text>
            }
            footer={<MyLoadingButton label="Create" onPress={createMatch} />}
          >
            {renderCreateMatchForm()}

          </MyCustomBottomSheet>

          <MyCustomBottomSheet
            onCloseSheet={() => { setTicketsAmount(0) }}
            ref={joinMatchBottomSheet}
            snapPoints={["40%", "50%"]}
            footer={<MyLoadingButton label="Join match" onPress={purchaseTickets} />}
            header={

              <Text style={styles.modalTitle} variant="headlineSmall">
                {selectedMatch ? selectedMatch.localName : ''}
                {""} vs {""}
                {selectedMatch ? selectedMatch.visitorName : ''}
              </Text>

            }>

            <ScrollView>
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
                Ticket cost:{" $"}
                {selectedMatch ? selectedMatch?.entryCost : ''}
              </Text>

              <Text variant="bodyLarge">
                Total $:{" "}
                {selectedMatch ? (selectedMatch?.entryCost * ticketsAmount) : ''}
              </Text>
            </ScrollView>


          </MyCustomBottomSheet>

        </>
      )}

    </View>
  );

};


const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: colors.light,
  },
  listContent: {
    padding: 16,
  },
  fabContainer: {
    position: "absolute",
    right: 16,
    bottom: 16,
    alignItems: "flex-end",
    gap: 16,
  },
  modalTitle: {
    textAlign: "center",
    marginVertical: 16,
  },
  closeCameraFab: {
    position: "absolute",
    right: 16,
    top: Platform.select({ ios: 60, android: 40 }),
    backgroundColor: colors.dark,
  },
  cameraLoading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  inputSpacing: {
    marginBottom: 16,
  },
  formContainer: {

  },
});

export default MatchesScreen;