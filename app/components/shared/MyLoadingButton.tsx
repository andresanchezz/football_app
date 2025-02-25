import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { useStateStore } from '../../state';

interface MyLoadingButtonProps {
  label: string; 
  onPress: ()=>void
}

export const MyLoadingButton: React.FC<MyLoadingButtonProps> = ({ label, onPress }) => {

    const { isLoading } = useStateStore();

    return (
        <TouchableOpacity style={styles.button} onPress={onPress} disabled={isLoading ? true : false}>
            {isLoading ? (
                <ActivityIndicator />
            ) : (
                <Text variant='bodyLarge' style={styles.textButton}>{label || 'Click'}</Text>
            )}
        </TouchableOpacity>
    );
};


const styles = StyleSheet.create({
    button:{
        marginVertical: 10,
        backgroundColor: 'red',
        paddingVertical: 15,
        borderRadius: 4
    },
    textButton: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 600
    }
})