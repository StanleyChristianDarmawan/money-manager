import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import BudgetSummary from "./BudgetSummary";
import TransactionTimeline from "./Timeline";

const HomeScreen = () => {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Welcome Back 👋</Text>

      <View style={styles.section}>
        <BudgetSummary />
      </View>

      <View style={styles.section}>
        <TransactionTimeline />
      </View>

      {/* Button to go to Insights */}
      <TouchableOpacity style={styles.button} onPress={() => router.push("/Insight")}>
        <View style={styles.buttonContent}>
          <Ionicons name="analytics-outline" size={20} color="#6C3EB7" style={{ marginRight: 10 }} />
          <Text style={styles.buttonText}>View Insights</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingHorizontal: 16,
    backgroundColor: "#5B2C82",
    paddingBottom: 60,
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
  button: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    elevation: 4,
    marginTop: 10,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#6C3EB7",
    fontWeight: "600",
  },
});

export default HomeScreen;
