import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Region } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

// Definimos el tipo para la ubicación seleccionada
type SelectedPlace = {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
} | null;

const PlaceScreen = () => {
    const [selectedPlace, setSelectedPlace] = useState<SelectedPlace>(null);

    const INITIAL_REGION: Region = {
        latitude: 37.33,
        longitude: -122,
        latitudeDelta: 2,
        longitudeDelta: 2,
    };

    const handlePlaceSelect = (details: any) => {
        // Validar que details y details.geometry existan
        if (!details || !details.geometry || !details.geometry.location) {
            console.error('Detalles del lugar no válidos:', details);
            return;
        }

        const { geometry } = details;
        const location: SelectedPlace = {
            latitude: geometry.location.lat,
            longitude: geometry.location.lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        };
        setSelectedPlace(location); // Actualiza la ubicación seleccionada
    };

    return (
        <View style={{ flex: 1 }}>
            <GooglePlacesAutocomplete
                placeholder="Buscar lugar"
                onPress={(data, details = null) => {
                    if (details) {
                        handlePlaceSelect(details);
                    } else {
                        console.error('No se encontraron detalles del lugar seleccionado.');
                    }
                }}
                query={{
                    key: 'AIzaSyAvM9_t9vcwwev-iyuaIoqtNWcjRrzI4ew', // Reemplaza con tu clave de API
                    language: 'es', // Idioma de los resultados
                }}
                styles={{
                    textInputContainer: {
                        backgroundColor: 'rgba(0,0,0,0)',
                        borderTopWidth: 0,
                        borderBottomWidth: 0,
                    },
                    textInput: {
                        marginLeft: 0,
                        marginRight: 0,
                        height: 38,
                        color: '#5d5d5d',
                        fontSize: 16,
                    },
                    predefinedPlacesDescription: {
                        color: '#1faadb',
                    },
                    listView: {
                        backgroundColor: 'white', // Fondo de la lista de resultados
                    },
                }}
                enablePoweredByContainer={false} // Oculta el mensaje "Powered by Google"
                fetchDetails={true} // Asegura que se obtengan los detalles completos del lugar
            />

            <MapView
                style={[StyleSheet.absoluteFill, { zIndex: -1 }]}
                initialRegion={INITIAL_REGION}
                provider={PROVIDER_GOOGLE}
                showsUserLocation
                showsMyLocationButton
                region={selectedPlace ? selectedPlace : INITIAL_REGION} // Mueve el mapa a la ubicación seleccionada
            >
                {selectedPlace && (
                    <Marker
                        coordinate={{
                            latitude: selectedPlace.latitude,
                            longitude: selectedPlace.longitude,
                        }}
                        title="Lugar seleccionado"
                    />
                )}
            </MapView>
        </View>
    );
};

export default PlaceScreen;