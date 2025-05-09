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
    borderRadius: 10,
    margin: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    color: "white",
    fontSize: 14,
  },
  expense: {
    color: "orange",
    fontSize: 18,
    fontWeight: "bold",
  },
  income: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  right: {
    alignItems: "flex-end",
  },
  leftToSpend: {
    color: "white",
  },
  budgetAmount: {
    color: "white",
  },
  leftAmount: {
    color: "white",
    fontSize: 16,
  },
  totalBudget: {
    color: "white",
    fontSize: 16,
  },
  progressBar: {
    marginTop: 10,
    height: 6,
    borderRadius: 5,
  },
});

export default BudgetSummary;
