import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { PieChart, LineChart } from "react-native-chart-kit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const screenWidth = Dimensions.get("window").width;

const Insight = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [highestCategory, setHighestCategory] = useState(null);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "transactions"));

        const categoryTotals = {};
        let expenseSum = 0;
        let incomeSum = 0;

        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const currentYear = today.getFullYear();

        querySnapshot.forEach((doc) => {
          const transaction = { id: doc.id, ...doc.data() };
          const txDate = new Date(transaction.date);
          const txMonth = txDate.getMonth() + 1;
          const txYear = txDate.getFullYear();

          if (txMonth === currentMonth && txYear === currentYear) {
            if (transaction.amount < 0) {
              const amount = Math.abs(transaction.amount);
              expenseSum += amount;
              const category = transaction.category;
              categoryTotals[category] = (categoryTotals[category] || 0) + amount;
            } else {
              incomeSum += transaction.amount;
            }
          }
        });

        setTotalExpense(expenseSum);
        setTotalIncome(incomeSum);

        const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"];
        const data = Object.entries(categoryTotals).map(([category, amount], index) => ({
          name: category,
          amount,
          color: colors[index % colors.length],
          legendFontColor: "#333",
          legendFontSize: 14,
        }));

        setCategoryData(data);

        if (data.length > 0) {
          const max = data.reduce((prev, current) => (prev.amount > current.amount ? prev : current));
          setHighestCategory(max);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  const lineChartData = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        data: [500, 300, 600, 700, 900, 1200, 1500],
        color: (opacity = 1) => `rgba(108, 62, 183, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <Text style={styles.header}>Insights 📊</Text>

      <View style={styles.cardRow}>
        <View style={styles.card}>
          <Text style={styles.label}>Total Income</Text>
          <Text style={styles.income}>Rp{totalIncome.toLocaleString("id-ID")}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Total Expenses</Text>
          <Text style={styles.expense}>Rp{totalExpense.toLocaleString("id-ID")}</Text>
        </View>
      </View>

      {highestCategory && (
        <Text style={styles.summary}>
          Your highest spending category this month is{" "}
          <Text style={styles.highlight}>{highestCategory.name}</Text> with Rp
          {highestCategory.amount.toLocaleString("id-ID")}.
        </Text>
      )}

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Expense Breakdown</Text>
        <PieChart
          data={categoryData}
          width={screenWidth - 32}
          height={220}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
          chartConfig={{
            color: () => `black`,
            labelColor: () => `black`,
          }}
          style={{ alignSelf: "center" }}
        />
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Weekly Spending</Text>
        <LineChart
          data={lineChartData}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(108, 62, 183, ${opacity})`,
            labelColor: () => `#333`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#6C3EB7",
            },
          }}
          bezier
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5B2C82",
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    width: "48%",
    elevation: 4,
  },
  label: {
    fontSize: 14,
    color: "#888888",
    marginBottom: 4,
  },
  income: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  expense: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F44336",
  },
  summary: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 20,
  },
  highlight: {
    fontWeight: "bold",
    color: "#FFCE56",
  },
  chartCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 4,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#6C3EB7",
    textAlign: "center",
  },
});

export default Insight;
