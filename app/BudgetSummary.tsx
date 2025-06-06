import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ProgressBar } from "react-native-paper";
import { collection, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase";

const BudgetSummary = () => {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [budget, setBudget] = useState(2000000);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.log("No user logged in");
        setLoading(false);
        return;
      }

      try {
        const querySnapshot = await getDocs(collection(db, "transactions"));

        let totalIncome = 0;
        let totalExpense = 0;

        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const currentYear = today.getFullYear();

        querySnapshot.forEach((doc) => {
          const transaction = { id: doc.id, ...doc.data() };

          if (transaction.userId_creator === user.uid) {
            const txDate = new Date(transaction.date);
            const txMonth = txDate.getMonth() + 1;
            const txYear = txDate.getFullYear();

            if (txMonth === currentMonth && txYear === currentYear) {
              if (transaction.amount < 0) {
                totalExpense += Math.abs(transaction.amount);
              } else {
                totalIncome += transaction.amount;
              }
            }
          }
        });

        setIncome(totalIncome);
        setExpense(totalExpense);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const leftToSpend = budget - expense;
  const progress = budget > 0 ? expense / budget : 0;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View>
          <Text style={styles.label}>This Month Expenses</Text>
          <Text style={styles.expense}>{expense.toLocaleString()} ▼</Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.label}>This Month Income</Text>
          <Text style={styles.income}>{income.toLocaleString()} ▲</Text>
        </View>
      </View>

      <Text style={styles.label}>Monthly Budget</Text>
      <View style={styles.row}>
        <Text style={styles.leftToSpend}>Left to spend</Text>
        <Text style={styles.budgetAmount}>Monthly Budget</Text>
      </View>
      <View style={styles.row}>
        <Text style={[
          styles.leftAmount,
          leftToSpend < 0 ? styles.negativeAmount : null
        ]}>
          {leftToSpend.toLocaleString()}
        </Text>
        <Text style={styles.totalBudget}>{budget.toLocaleString()}</Text>
      </View>

      <ProgressBar 
        progress={progress > 1 ? 1 : progress} 
        color={progress > 0.9 ? "#FF5252" : "orange"} 
        style={styles.progressBar} 
      />
      
      {progress > 1 && (
        <Text style={styles.overBudget}>
          You've exceeded your monthly budget by {(expense - budget).toLocaleString()}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#6C3EB7",
    padding: 20,
    borderRadius: 16,
    margin: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  label: {
    color: "#E0E0E0",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  expense: {
    color: "#FFA726",
    fontSize: 20,
    fontWeight: "bold",
  },
  income: {
    color: "#B2FF59",
    fontSize: 20,
    fontWeight: "bold",
  },
  right: {
    alignItems: "flex-end",
  },
  leftToSpend: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  budgetAmount: {
    color: "#CCCCCC",
    fontSize: 16,
    fontWeight: "500",
  },
  leftAmount: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  negativeAmount: {
    color: "#FF5252",
  },
  totalBudget: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  progressBar: {
    marginTop: 20,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#D1C4E9",
  },
  overBudget: {
    color: "#FF5252",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
    textAlign: "right",
  },
});

export default BudgetSummary;