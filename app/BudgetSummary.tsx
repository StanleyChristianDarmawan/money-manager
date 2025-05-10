import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ProgressBar } from "react-native-paper";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const BudgetSummary = () => {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [budget, setBudget] = useState(2000000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const db = getFirestore();

        const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const monthEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

        const incomeRef = collection(db, "users", user.uid, "income");
        const expenseRef = collection(db, "users", user.uid, "expenses");

        const qIncome = query(incomeRef, where("date", ">=", monthStart.toISOString().split("T")[0]));
        const qExpense = query(expenseRef, where("date", ">=", monthStart.toISOString().split("T")[0]));

        const incomeSnap = await getDocs(qIncome);
        const expenseSnap = await getDocs(qExpense);

        let totalIncome = 0;
        incomeSnap.forEach((doc) => {
          totalIncome += doc.data().amount;
        });

        let totalExpense = 0;
        expenseSnap.forEach((doc) => {
          totalExpense += doc.data().amount;
        });

        setIncome(totalIncome);
        setExpense(totalExpense);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const leftToSpend = budget - expense;
  const progress = budget > 0 ? expense / budget : 0;

  // if (loading) {
  //   return (
  //     <View style={styles.container}>
  //       <Text style={{ color: "white" }}>Loading...</Text>
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View>
          <Text style={styles.label}>This Month Expenses</Text>
          <Text style={styles.expense}>{expense.toLocaleString()} ▼</Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.label}>This Month Income</Text>
          <Text style={styles.income}>{income.toLocaleString()}</Text>
        </View>
      </View>

      <Text style={styles.label}>Monthly Budget</Text>
      <View style={styles.row}>
        <Text style={styles.leftToSpend}>Left to spend</Text>
        <Text style={styles.budgetAmount}>Monthly Budget</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.leftAmount}>{leftToSpend.toLocaleString()}</Text>
        <Text style={styles.totalBudget}>{budget.toLocaleString()}</Text>
      </View>

      <ProgressBar progress={progress} color="orange" style={styles.progressBar} />
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
    color: "#FFA726", // warmer orange
    fontSize: 20,
    fontWeight: "bold",
  },
  income: {
    color: "#B2FF59", // bright green
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
  totalBudget: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  progressBar: {
    marginTop: 20,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#D1C4E9", // lighter background to contrast orange bar
  },
});

export default BudgetSummary;
