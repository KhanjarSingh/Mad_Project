import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { queueService } from '../services/queueService';

export default function QueueDetailsScreen({ route }) {
  const { queueId } = route.params;
  const [queue, setQueue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const data = await queueService.getQueueDetails(queueId);
      setQueue(data);
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to load queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [queueId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const handleJoin = async () => {
    try {
      setJoining(true);
      await queueService.joinQueue(queueId);
      await load();
    } catch (err) {
      Alert.alert('Join Failed', err.message || 'Please try again');
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    try {
      setLeaving(true);
      await queueService.leaveQueue(queueId);
      await load();
    } catch (err) {
      Alert.alert('Leave Failed', err.message || 'Please try again');
    } finally {
      setLeaving(false);
    }
  };

  if (loading && !queue) {
    return (
      <View style={styles.center}> 
        <Text>Loading…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{queue?.name}</Text>
      {queue?.description ? <Text style={styles.subtitle}>{queue.description}</Text> : null}

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#4CAF50' }, joining && { opacity: 0.6 }]} onPress={handleJoin} disabled={joining}>
          <Text style={styles.buttonText}>{joining ? 'Joining…' : 'Join Queue'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#f44336' }, leaving && { opacity: 0.6 }]} onPress={handleLeave} disabled={leaving}>
          <Text style={styles.buttonText}>{leaving ? 'Leaving…' : 'Leave Queue'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Members</Text>
      <FlatList
        data={queue?.members || []}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item, index }) => (
          <View style={styles.memberRow}>
            <Text style={styles.memberPos}>#{index + 1}</Text>
            <Text style={styles.memberName}>{item.user?.name || 'Unknown'}</Text>
            <Text style={styles.memberTime}>{new Date(item.joinedAt).toLocaleTimeString()}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: 'gray' }}>No members yet</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold' },
  subtitle: { color: 'gray', marginBottom: 16 },
  actions: { flexDirection: 'row', gap: 12, marginVertical: 12 },
  button: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  sectionTitle: { marginTop: 8, marginBottom: 8, fontWeight: 'bold' },
  memberRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  memberPos: { width: 40, fontWeight: 'bold' },
  memberName: { flex: 1 },
  memberTime: { color: 'gray' },
});



