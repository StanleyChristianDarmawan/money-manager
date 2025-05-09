import React from "react";
import { View, StyleSheet } from "react-native";
import BudgetSummary from "./BudgetSummary";
import TransactionTimeline from "./Timeline";

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <BudgetSummary />
      <TransactionTimeline />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5B2C82",
    paddingTop: 40,
  },
});

export default HomeScreen;
