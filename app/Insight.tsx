import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from "react-native";
import { PieChart, LineChart } from "react-native-chart-kit";
// import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const screenWidth = Dimensions.get("window").width;

const Insight = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [highestCategory, setHighestCategory] = useState(null);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
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

        const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"];
        const data = Object.entries(categoryTotals).map(([category, amount], index) => ({
          name: category,
          amount,
          color: colors[index % colors.length],
          legendFontColor: "#D1C4E9",
          legendFontSize: 12,
        }));

        setCategoryData(data);

        if (data.length > 0) {
          const max = data.reduce((prev, current) => (prev.amount > current.amount ? prev : current));
          setHighestCategory(max);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const lineChartData = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        data: [500, 300, 600, 700, 900, 1200, 1500],
        color: (opacity = 1) => `rgba(138, 82, 229, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: "transparent",
    backgroundGradientFrom: "rgba(255, 255, 255, 0.1)",
    backgroundGradientTo: "rgba(255, 255, 255, 0.05)",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(138, 82, 229, ${opacity})`,
    labelColor: () => `#D1C4E9`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#8A52E5",
      fill: "#8A52E5",
    },
    propsForBackgroundLines: {
      strokeDasharray: "",
      stroke: "rgba(255, 255, 255, 0.1)",
    },
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8A52E5" />
          <Text style={styles.loadingText}>Loading insights...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Ionicons name="analytics" size={28} color="#8A52E5" />
          <Text style={styles.headerText}>Financial Insights</Text>
        </View>

        <View style={styles.summaryCards}>
          <View style={styles.summaryCard}>
            <View style={styles.cardIcon}>
              <Ionicons name="trending-up" size={24} color="#4CAF50" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>Total Income</Text>
              <Text style={styles.incomeValue}>Rp{totalIncome.toLocaleString("id-ID")}</Text>
            </View>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.cardIcon}>
              <Ionicons name="trending-down" size={24} color="#FF6B6B" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>Total Expenses</Text>
              <Text style={styles.expenseValue}>Rp{totalExpense.toLocaleString("id-ID")}</Text>
            </View>
          </View>
        </View>

        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Ionicons name="wallet" size={20} color="#8A52E5" />
            <Text style={styles.balanceLabel}>Net Balance</Text>
          </View>
          <Text style={[
            styles.balanceValue,
            { color: totalIncome - totalExpense >= 0 ? '#4CAF50' : '#FF6B6B' }
          ]}>
            Rp{(totalIncome - totalExpense).toLocaleString("id-ID")}
          </Text>
        </View>

        {highestCategory && (
          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <Ionicons name="bulb" size={20} color="#FFD700" />
              <Text style={styles.insightTitle}>Monthly Insight</Text>
            </View>
            <Text style={styles.insightText}>
              Your highest spending category this month is{" "}
              <Text style={styles.highlightText}>{highestCategory.name}</Text> with{" "}
              <Text style={styles.highlightAmount}>Rp{highestCategory.amount.toLocaleString("id-ID")}</Text>
            </Text>
          </View>
        )}

        {categoryData.length > 0 && (
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Ionicons name="pie-chart" size={20} color="#8A52E5" />
              <Text style={styles.chartTitle}>Expense Breakdown</Text>
            </View>
            <PieChart
              data={categoryData}
              width={screenWidth - 64}
              height={220}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              chartConfig={{
                color: () => `#D1C4E9`,
                labelColor: () => `#D1C4E9`,
              }}
              style={styles.chart}
            />
          </View>
        )}

        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Ionicons name="stats-chart" size={20} color="#8A52E5" />
            <Text style={styles.chartTitle}>Weekly Spending Trend</Text>
          </View>
          <LineChart
            data={lineChartData}
            width={screenWidth - 64}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1128',
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#D1C4E9',
    fontSize: 16,
    marginTop: 12,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  headerText: {
    fontSize: 22,
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 12,
  },
  summaryCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(138, 82, 229, 0.2)',
  },
  cardIcon: {
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 12,
    color: '#D1C4E9',
    marginBottom: 4,
    fontWeight: '500',
  },
  incomeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  expenseValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  balanceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(138, 82, 229, 0.2)',
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#D1C4E9',
    marginLeft: 8,
    fontWeight: '500',
  },
  balanceValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  insightCard: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: '600',
    marginLeft: 8,
  },
  insightText: {
    fontSize: 14,
    color: '#D1C4E9',
    lineHeight: 20,
  },
  highlightText: {
    fontWeight: '600',
    color: '#FFD700',
  },
  highlightAmount: {
    fontWeight: '600',
    color: '#4CAF50',
  },
  chartCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(138, 82, 229, 0.2)',
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginLeft: 8,
  },
  chart: {
    alignSelf: 'center',
    borderRadius: 16,
  },
});

export default Insight;