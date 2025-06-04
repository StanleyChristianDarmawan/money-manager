import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import BudgetSummary from "./BudgetSummary";
import TransactionTimeline from "./Timeline";
import BudgetGeneratorScreen from './GeneratedBudget';

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

      {/* Button to go to Add Income Page */}
      <TouchableOpacity style={styles.addButton} onPress={() => router.push("/add-income")}>
        <View style={styles.buttonContent}>
          <Ionicons name="cash-outline" size={20} color="#4CAF50" style={{ marginRight: 10 }} />
          <Text style={styles.buttonText}>Add Income</Text>
        </View>
      </TouchableOpacity>

      {/* Button to go to Add Expense Page */}
      <TouchableOpacity style={styles.addButton} onPress={() => router.push("/add-expense")}>
        <View style={styles.buttonContent}>
          <Ionicons name="wallet-outline" size={20} color="#F44336" style={{ marginRight: 10 }} />
          <Text style={styles.buttonText}>Add Expense</Text>
        </View>
      </TouchableOpacity>

      {/* Button to go to AI Page */}
      <TouchableOpacity style={styles.addButton} onPress={() => router.push("/GeneratedBudget")}>
        <View style={styles.buttonContent}>
          <Ionicons name="sparkles-outline" size={20} color="#dede04" style={{ marginRight: 10 }} />
          <Text style={styles.buttonText}>AI Helper</Text>
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
  addButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    elevation: 4,
    marginTop: 10,
  },
});

export default HomeScreen;
