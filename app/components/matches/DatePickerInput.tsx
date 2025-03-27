import React from 'react';
import { Pressable, View } from 'react-native';
import { TextInput } from 'react-native-paper';

interface DatePickerInputProps {
  label: string;
  value: string;
  onPress: () => void;
}

const DatePickerInput = ({ label, value, onPress }: DatePickerInputProps) => (
  <Pressable onPress={onPress}>
    <View pointerEvents="none">
      <TextInput
        mode="outlined"
        label={label}
        value={value}
        editable={false}
      />
    </View>
  </Pressable>
);

export default DatePickerInput;