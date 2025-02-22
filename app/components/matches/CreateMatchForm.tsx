import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';

import { Dropdown } from "react-native-paper-dropdown";

export const CreateMatchForm = () => {
    return (
        <View>

            <Text>Create match form</Text>


            <TextInput mode='outlined' label="People capacity" inputMode='numeric'></TextInput>
            <TextInput mode='outlined' label="Local name"></TextInput>
            <TextInput mode='outlined' label="Local visitor" ></TextInput>
            <TextInput mode='outlined' label="Entry cost" inputMode='numeric'></TextInput>


            <TextInput mode='outlined' label="Date start" ></TextInput>
            <TextInput mode='outlined' label="Date finished" ></TextInput>

            <Dropdown
            label="Place"
                mode='outlined'
                options={[

                ]}

            />

            <TouchableOpacity>
                <Text>Create</Text>
            </TouchableOpacity>

        </View>
    )
}
