import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Minimal app for debugging
export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🚗 Ride Hailing App</Text>
      <Text style={styles.subtext}>App is running successfully!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtext: {
    fontSize: 16,
    color: '#666',
  },
});
