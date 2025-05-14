//ignore the red text since most of them are relevant for this code to work


import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase"; // Make sure this path is correct
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

const Insight = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [highestCategory, setHighestCategory] = useState(null);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Get all transactions from the same collection as TransactionTimeline
        const querySnapshot = await getDocs(collection(db, "transactions"));
        
        const categoryTotals = {};
        let expenseSum = 0;
        let incomeSum = 0;
        
        // Get current month for filtering
        const today = new Date();
        const currentMonth = today.getMonth() + 1; // JavaScript months are 0-indexed
        const currentYear = today.getFullYear();
        
        querySnapshot.forEach((doc) => {
          const transaction = { id: doc.id, ...doc.data() };
          
          // Parse date to check if it's in the current month
          const txDate = new Date(transaction.date);
          const txMonth = txDate.getMonth() + 1;
          const txYear = txDate.getFullYear();
          
          // Only process transactions from the current month
          if (txMonth === currentMonth && txYear === currentYear) {
            if (transaction.amount < 0) {
              // It's an expense
              const amount = Math.abs(transaction.amount);
              expenseSum += amount;
              
              // Group by category
              const category = transaction.category;
              if (categoryTotals[category]) {
                categoryTotals[category] += amount;
              } else {
                categoryTotals[category] = amount;
              }
            } else {
              // It's income
              incomeSum += transaction.amount;
            }
          }
        });
        
        setTotalExpense(expenseSum);
        setTotalIncome(incomeSum);
        
        // Format category data for the pie chart
        const data = Object.keys(categoryTotals).map((category, index) => {
          const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"];
          return {
            name: category,
            amount: categoryTotals[category],
            color: colors[index % colors.length],
            legendFontColor: "#FFFFFF",
            legendFontSize: 14,
          };
        });
        
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
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <Text style={styles.title}>Spending Insights</Text>
      
      <View style={styles.summaryCards}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Income</Text>
          <Text style={styles.incomeValue}>Rp{totalIncome.toLocaleString("id-ID")}</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Expenses</Text>
          <Text style={styles.expenseValue}>Rp{totalExpense.toLocaleString("id-ID")}</Text>
        </View>
      </View>
      
      {highestCategory && (
        <Text style={styles.summary}>
          Your highest spending category this month is <Text style={styles.highlight}>{highestCategory.name}</Text> with Rp{highestCategory.amount.toLocaleString("id-ID")}.
        </Text>
      )}
      
      {categoryData.length > 0 ? (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Expense Breakdown</Text>
          <PieChart
            data={categoryData}
            width={screenWidth - 32}
            height={220}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            chartConfig={{
              color: () => `white`,
              labelColor: () => `white`,
            }}
            style={{ alignSelf: "center" }}
          />
        </View>
      ) : (
        <Text style={styles.noData}>No expense data available for this month.</Text>
      )}
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  summaryCards: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 16, 
    width: "48%",
  },
  cardLabel: {
    color: "#E0E0E0",
    fontSize: 14,
    marginBottom: 8,
  },
  incomeValue: {
    color: "#4CAF50",
    fontSize: 18,
    fontWeight: "bold",
  },
  expenseValue: {
    color: "#FF6384",
    fontSize: 18,
    fontWeight: "bold",
  },
  summary: {
    fontSize: 16,
    color: "#E0E0E0",
    marginBottom: 20,
  },
  highlight: {
    color: "#FF9F40",
    fontWeight: "bold",
  },
  chartContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.07)",
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
  },
  chartTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  noData: {
    color: "#CCCCCC",
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
  },
});

export default Insight;