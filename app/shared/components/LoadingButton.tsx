import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useHomeStore, useStateStore } from '../../state/index';

interface LoadingButtonProps {
  label?: string;
  onPress?: () => void;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({ label = 'Click', onPress }) => {
  const { isLoading } = useStateStore();

  return (
    <TouchableOpacity onPress={onPress} disabled={isLoading} style={{ padding: 10, backgroundColor: '#2196F3', borderRadius: 5 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: 'white' }}>{label}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default LoadingButton