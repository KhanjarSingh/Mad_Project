import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ProfileScreen from "../screens/ProfileScreen";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState, useCallback } from "react";
import { queueService } from "../services/queueService";
const Tab = createBottomTabNavigator();


function QueuesScreen() {
  const navigation = useNavigation();
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await queueService.getAllQueues();
      setQueues(data);
    } catch (err) {
      // Keep it simple for now; production apps should alert
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('QueueDetails', { queueId: item.id })}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        {item.description ? <Text style={styles.itemSub}>{item.description}</Text> : null}
      </View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{item._count?.members ?? 0}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading…</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={{ padding: 12 }}
      data={queues}
      keyExtractor={(q) => String(q.id)}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      ListEmptyComponent={<Text style={{ textAlign: 'center', color: 'gray', marginTop: 24 }}>No queues yet</Text>}
    />
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Queues") iconName = "list";
          else if (route.name === "Profile") iconName = "person";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Queues" component={QueuesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  item: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#eee' },
  itemTitle: { fontWeight: 'bold', marginBottom: 2 },
  itemSub: { color: 'gray' },
  badge: { backgroundColor: '#4a90e2', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  badgeText: { color: '#fff', fontWeight: 'bold' },
});
