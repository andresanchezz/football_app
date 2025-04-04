import React, { useRef, useState } from 'react';
import {
    Image,
    StyleSheet,
    TouchableOpacity,
    View,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Region, PROVIDER_DEFAULT } from 'react-native-maps';
import { GooglePlaceData, GooglePlacesAutocomplete, GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete';
import { Dimensions } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { MyLoadingButton } from '../../components/shared/MyLoadingButton';
import { apiServices } from '../../api/services-qps';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import Toast from 'react-native-toast-message';
import { useStateStore } from '../../state';


type SelectedPlace = {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
} | null;

const PlaceScreen = () => {

    const placeAutocompleteRef = useRef<GooglePlacesAutocompleteRef>(null);

    const h = Dimensions.get("screen").height;
    const [selectedPlace, setSelectedPlace] = useState<SelectedPlace>(null);
    const [placeName, setPlaceName] = useState<string>('');
    const [images, setImages] = useState<string[]>([]);

    const { setIsLoading } = useStateStore();

    const INITIAL_REGION: Region = {
        latitude: 37.33,
        longitude: -122,
        latitudeDelta: 2,
        longitudeDelta: 2,
    };

    const handlePlaceSelect = (details: any) => {
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
        setSelectedPlace(location);
    };

    const handleAddImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const newImage = result.assets[0].uri;
            const base64Image = await FileSystem.readAsStringAsync(newImage, { encoding: FileSystem.EncodingType.Base64 });
            const base64WithPrefix = `data:image/jpeg;base64,${base64Image}`; // Agregar el prefijo
            setImages((prevImages) => [...(prevImages || []), base64WithPrefix]); // Almacenar con prefijo
        }
    };

    const handleCreatePlace = async () => {

        if (!placeName || !selectedPlace || !images || images.length === 0) {
            Toast.show(
                {
                    type: 'error',
                    text1: 'All fileds required',
                    text2: 'Name, location and at least one image'
                }
            )
            return;
        }

        const formData = new FormData();

        formData.append('name', placeName);
        formData.append('address', `${selectedPlace.latitude}, ${selectedPlace.longitude}`);

        images.forEach((image, index) => {
            formData.append('images', {
                uri: image,
                name: `image_${index}.jpg`,
                type: 'image/jpeg',
            });
        });


        try {
            setIsLoading(true)
            await apiServices.post('/place/addplace', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            Toast.show(
                {
                    type: 'success',
                    text1: 'Place created',
                }
            )

            setSelectedPlace(null);
            setImages([])
            setPlaceName('')
            if (placeAutocompleteRef.current) {
                placeAutocompleteRef.current.clear();
            }

        } catch (error: any) {
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.mainContainer}
        >
            <View style={{ flex: 1 }}>

                <TextInput
                    style={{ marginVertical: 10 }}
                    mode='outlined'
                    placeholder='Place name'
                    value={placeName}
                    onChangeText={setPlaceName}
                />

                <View style={{ height: h * .35 }}>
                    <GooglePlacesAutocomplete
                        ref={placeAutocompleteRef}
                        placeholder="Search place"
                        onPress={(data, details = null) => {
                            if (details) {
                                handlePlaceSelect(details);
                            }
                        }}
                        query={{
                            key: 'AIzaSyAvM9_t9vcwwev-iyuaIoqtNWcjRrzI4ew',
                            language: 'es',
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
                                color: '#5d5d5d',
                                fontSize: 16,
                                borderRadius: 0
                            },
                            predefinedPlacesDescription: {
                                color: '#1faadb',
                            },
                            listView: {
                                backgroundColor: 'white',
                            },
                        }}
                        enablePoweredByContainer={false}
                        fetchDetails={true}
                    />

                    <MapView
                        style={[StyleSheet.absoluteFill, { zIndex: -1 }]}
                        initialRegion={INITIAL_REGION}
                        provider={PROVIDER_DEFAULT}
                        showsUserLocation
                        showsMyLocationButton
                        region={selectedPlace ? selectedPlace : INITIAL_REGION}
                    >
                        {selectedPlace && (
                            <Marker
                                coordinate={{
                                    latitude: selectedPlace.latitude,
                                    longitude: selectedPlace.longitude,
                                }}
                                title="Selected place"
                            />
                        )}
                    </MapView>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.imageContainer}
                >
                    <TouchableOpacity style={styles.addImageButton} onPress={handleAddImage}>
                        <Text style={styles.addImageText}>+</Text>
                    </TouchableOpacity>
                    {images?.map((image, index) => (
                        <Image key={index} source={{ uri: image }} style={styles.image} />
                    ))}

                </ScrollView>

                <MyLoadingButton label='Create place' onPress={handleCreatePlace} />
            </View>
        </KeyboardAvoidingView>
    );
};

export default PlaceScreen;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: 20,

    },
    imageContainer: {
        marginTop: 20,
        flexDirection: 'row',
        minWidth: '100%'
    },
    image: {
        width: 100,
        height: 100,
        marginRight: 10,
        borderRadius: 10,
    },
    addImageButton: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        marginRight: 10,
    },
    addImageText: {
        fontSize: 24,
        color: '#ccc',
    },
});