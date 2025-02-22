import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';

import { Dropdown } from "react-native-paper-dropdown";
import { Match } from '../../interfaces/matches/match';

interface MatchDetailsProps {
    match: Match
}

export const MatchDetails: React.FC<MatchDetailsProps> = ({ match }) => {
    return (
        <View>
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