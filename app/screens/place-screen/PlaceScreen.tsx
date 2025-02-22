import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Text } from 'react-native-paper';

const PlaceScreen = () => {
    const INITIAL_REGION = {
        latitude: 37.33,
        longitude: -122,
        latitudeDelta: 2,
        longitudeDelta: 2
    }

    return (
        <View style={{flex: 1}}>
            <MapView
                style={[StyleSheet.absoluteFill, { zIndex: 0 }]}
                initialRegion={INITIAL_REGION}
                provider={PROVIDER_GOOGLE}
                showsUserLocation
                showsMyLocationButton
            ></MapView>
        </View>
    )
}

export default PlaceScreen


