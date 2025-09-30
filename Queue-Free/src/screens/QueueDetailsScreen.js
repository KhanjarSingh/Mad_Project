import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';

const QueueDetailsScreen = ({ route, navigation }) => {
    const { queueId } = route.params;
    const [queueDetails, setQueueDetails] = useState(null);
    const [isInQueue, setIsInQueue] = useState(false);

    useEffect(() => {
        fetchQueueDetails();
    }, [queueId]);

    const fetchQueueDetails = async () => {
        // TODO: Replace with actual API call
        const mockDetails = {
            id: queueId,
            name: 'Sample Queue',
            currentNumber: 45,
            yourNumber: isInQueue ? 48 : null,
            peopleAhead: 3,
            estimatedWaitTime: '15 minutes',
            totalPeople: 10,
        };
        setQueueDetails(mockDetails);
    };

    const handleJoinQueue = () => {
        // TODO: Implement join queue logic
        Alert.alert(
            'Join Queue',
            'Are you sure you want to join this queue?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Join',
                    onPress: async () => {
                        try {
                            // TODO: API call to join queue
                            setIsInQueue(true);
                            Alert.alert('Success', 'You have joined the queue!');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to join queue');
                        }
                    },
                },
            ]
        );
    };

    const handleLeaveQueue = () => {
        Alert.alert(
            'Leave Queue',
            'Are you sure you want to leave this queue?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Leave',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // TODO: API call to leave queue
                            setIsInQueue(false);
                            Alert.alert('Success', 'You have left the queue');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to leave queue');
                        }
                    },
                },
            ]
        );
    };

    if (!queueDetails) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.queueName}>{queueDetails.name}</Text>

                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{queueDetails.currentNumber}</Text>
                        <Text style={styles.statLabel}>Current Number</Text>
                    </View>

                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{queueDetails.totalPeople}</Text>
                        <Text style={styles.statLabel}>In Queue</Text>
                    </View>

                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{queueDetails.estimatedWaitTime}</Text>
                        <Text style={styles.statLabel}>Wait Time</Text>
                    </View>
                </View>

                {isInQueue && (
                    <View style={styles.yourStatus}>
                        <Text style={styles.statusTitle}>Your Status</Text>
                        <Text style={styles.statusNumber}>
                            Your Number: {queueDetails.yourNumber}
                        </Text>
                        <Text style={styles.statusText}>
                            People ahead of you: {queueDetails.peopleAhead}
                        </Text>
                    </View>
                )}

                <TouchableOpacity
                    style={[
                        styles.actionButton,
                        { backgroundColor: isInQueue ? '#FF3B30' : '#007AFF' }
                    ]}
                    onPress={isInQueue ? handleLeaveQueue : handleJoinQueue}
                >
                    <Text style={styles.buttonText}>
                        {isInQueue ? 'Leave Queue' : 'Join Queue'}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        margin: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    queueName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 25,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    yourStatus: {
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        padding: 15,
        marginBottom: 20,
    },
    statusTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    statusNumber: {
        fontSize: 16,
        color: '#007AFF',
        marginBottom: 5,
    },
    statusText: {
        fontSize: 16,
        color: '#666',
    },
    actionButton: {
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default QueueDetailsScreen;