import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { Match } from '../../interfaces/matches/match';
import moment from 'moment';

interface MatchCardProps {
    match: Match
    showDetails: () => void
    joinMatch: () => void
}

const MatchCard: React.FC<MatchCardProps> = ({ match, showDetails, joinMatch }) => {
    return (
        <Card style={styles.card}>
            <View style={styles.imageContainer}>
                <Card.Cover source={{ uri: 'https://your-image-url-here.jpg' }} style={styles.cardImage} />
                <View style={styles.overlayTextContainer}>
                    <Text style={styles.overlayText}>{match.registeredPeople} / {match.peopleCapacity}</Text>
                </View>
            </View>

            <Card.Content>
                <View style={styles.matchInfoContainer}>
                    <View style={styles.column}>
                        <Text style={styles.teamText}>{match.localName}</Text>
                        <Text style={styles.costText}>Ticket cost</Text>
                        <Text style={styles.timeText}>Start time</Text>
                        <Text style={styles.timeText}>End time</Text>

                    </View>
                    <View style={[styles.column, styles.columnLeft]}>
                        <Text style={styles.teamText}>{match.visitorName}</Text>
                        <Text style={styles.costText}>{match.entryCost}</Text>
                        <Text style={styles.timeText}>{moment(match.startTime).format('MMMM D, YYYY')}</Text>
                        <Text style={styles.timeText}>{moment(match.endTime).format('MMMM D, YYYY')}</Text>
                    </View>
                </View>
                <View style={{ height: 15 }}></View>
                <TouchableOpacity onPress={() => { showDetails() }}>
                    <Text>Details</Text>
                </TouchableOpacity>
                <View style={{ height: 15 }}></View>
                <TouchableOpacity onPress={() => { joinMatch() }}>
                    <Text >Join</Text>
                </TouchableOpacity>

            </Card.Content>
        </Card>
    )
}

export default MatchCard;

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        marginBottom: 20,
    },
    cardImage: {
        height: 170,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    imageContainer: {
        position: 'relative',
    },
    overlayTextContainer: {
        position: 'absolute',
        width: '100%',
        top: '10%',
        left: 0,
        right: 0,
        paddingHorizontal: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    overlayText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    matchInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 20,
    },
    column: {
        flex: 1,
        paddingRight: 10,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },

    columnLeft: {

    },

    teamText: {

    },
    costText: {

    },
    timeText: {

    },
});