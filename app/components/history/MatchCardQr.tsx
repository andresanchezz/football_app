import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Icon, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../styles/colors';
import { Match, MatchAdapted } from '../../interfaces/matches/match';

interface MatchQrProps {
    match: MatchAdapted
    showQr: (match:MatchAdapted) => void
}

const MatchCardQr: React.FC<MatchQrProps> = ({ match, showQr }) => {
    return (
        <Card style={styles.card}>
            <Card.Content>

                <Text style={[{ textAlign: 'center', fontWeight: 600 }]} variant='bodyMedium'>{match.localName} vs {match.visitorName}</Text>

                <View style={styles.matchInfoContainer}>

                    <View>
                        <Text variant='bodyMedium'>{match.matchDay}</Text>
                        <Text variant='bodyMedium'>{match.startTime} - {match.endTime}</Text>
                        <Text variant='bodyMedium'>{match.place.name}</Text>

                    </View>
                    <View >

                        <TouchableOpacity onPress={() => { showQr(match) }}>
                            <Ionicons name="qr-code-outline" size={40} color="black" />
                        </TouchableOpacity>

                    </View>
                </View>
            </Card.Content>
        </Card>
    )
}

export default MatchCardQr;

const styles = StyleSheet.create({
    card: {
        marginBottom: 10,
        borderRadius: 0,
        backgroundColor: colors.light
    },

    matchInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginTop: 5
    },

    teamText: {

    },
    costText: {

    },
    timeText: {

    },
});