import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
// import LinearGradient from "react-native-linear-gradient"; // Uncomment if using gradient
import BudgetSummary from "./BudgetSummary";
import TransactionTimeline from "./Timeline";

const HomeScreen = () => {
  return (
    // <LinearGradient colors={['#5B2C82', '#4A148C']} style={styles.container}> // Optional gradient
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Welcome Back 👋</Text>

      <View style={styles.section}>
        <BudgetSummary />
      </View>

      <View style={styles.section}>
        <TransactionTimeline />
      </View>
    </ScrollView>
    // </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingHorizontal: 16,
    backgroundColor: "#5B2C82",
    paddingBottom: 40,
  },
  header: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
});

export default HomeScreen;
