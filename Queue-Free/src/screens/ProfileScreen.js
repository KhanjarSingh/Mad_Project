import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>

      <Image
        source={{ uri: "https://via.placeholder.com/120" }} 
        style={styles.profileImage}
      />

      <Text style={styles.name}>Random new</Text>

      <Text style={styles.email}>random@example.com</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="settings-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: "#f44336" }]}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    padding: 20, 
    backgroundColor: "#fff" 
  },
  profileImage: { 
    width: 120, 
    height: 120, 
    borderRadius: 60, 
    marginBottom: 20, 
    borderWidth: 2, 
    borderColor: "#4a90e2" 
  },
  name: { fontSize: 22, fontWeight: "bold", marginBottom: 5 },
  email: { fontSize: 16, color: "gray", marginBottom: 30 },
  buttonContainer: { flexDirection: "row", gap: 15 },
  button: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#4a90e2", 
    paddingVertical: 10, 
    paddingHorizontal: 15, 
    borderRadius: 10, 
    gap: 8 
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
