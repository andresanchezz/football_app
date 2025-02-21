import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Card } from "react-native-paper";


export const MatchesScreen = () => {
  return (
    <View style={styles.mainView}>
      <Card style={styles.card}>
        <View style={styles.imageContainer}>
          <Card.Cover source={{ uri: 'https://your-image-url-here.jpg' }} style={styles.cardImage} />
          <View style={styles.overlayTextContainer}>
            <Text style={styles.overlayText}>11/20</Text>
          </View>
        </View>

        <Card.Content>
          <View style={styles.matchInfoContainer}>
            <View style={styles.column}>
              <Text style={styles.teamText}>Equipo 1</Text>
              <Text style={styles.costText}>Costo</Text>
              <Text style={styles.timeText}>Hora inicio</Text>

            </View>
            <View style={styles.column}>
              <Text style={styles.teamText}>Equipo 2</Text>
              <Text style={styles.costText}>$$</Text>
              <Text style={styles.timeText}>Hora finalización</Text>

            </View>
          </View>
          <View style={{ height: 15 }}></View>
          <TouchableOpacity>
            <Text>Details</Text>
          </TouchableOpacity>
          <View style={{ height: 15 }}></View>
          <TouchableOpacity>
            <Text >Join</Text>
          </TouchableOpacity>

        </Card.Content>
      </Card>



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
  card: {
    borderRadius: 10,
    marginBottom: 20,
  },
  cardImage: {
    height: 170,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  imageContainer: {
    position: 'relative',
  },
  overlayTextContainer: {
    position: 'absolute',
    width: '100%',
    top: '10%',
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  matchInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
  },
  column: {
    flex: 1,
    paddingRight: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  teamText: {

  },
  costText: {

  },
  timeText: {

  },
});
