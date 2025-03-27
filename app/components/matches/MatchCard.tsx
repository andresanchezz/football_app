import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { MatchAdapted } from '../../interfaces/matches/match';
import buttonStyles from '../../../assets/styles'

interface MatchCardProps {
    match: MatchAdapted
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
                        <Text>{match.localName}</Text>
                        <Text>Ticket cost</Text>
                        <Text>Schedule</Text>
                        <Text>Starts</Text>
                        <Text>Ends</Text>

                    </View>
                    <View style={styles.column}>
                        <Text>{match.visitorName}</Text>
                        <Text>$ {match.entryCost}</Text>
                        <Text>{match.matchDay}</Text>
                        <Text>{match.startTime}</Text>
                        <Text>{match.endTime}</Text>
                    </View>
                </View>
                <View style={{ height: 15 }}></View>

                <TouchableOpacity style={buttonStyles.buttonStyles.button} onPress={() => { joinMatch() }}>
                    <Text style={buttonStyles.buttonStyles.textButton} >Join</Text>
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



});