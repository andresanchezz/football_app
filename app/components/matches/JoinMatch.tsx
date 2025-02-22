import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';

import { Dropdown } from "react-native-paper-dropdown";
import { Match } from '../../interfaces/matches/match';

interface JoinMatchProps {
    match: Match
}

export const JoinMatch: React.FC<JoinMatchProps> = ({ match }) => {
    return (
        <View>

            <Text>Join this match </Text>
            <Text>{match.localName}</Text>
            <Text>{match.visitorName}</Text>
{/*             <Text>{match.startTime}</Text>
            <Text>{match.endTime}</Text>
            <Text>{match.}</Text>
            <Text>{match.visitorName}</Text>
 */}
        </View>
    )
}


const styles = StyleSheet.create({

})