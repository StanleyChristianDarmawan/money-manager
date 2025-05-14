//ignore the red text since most of them are relevant for this code to work

import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const { width } = Dimensions.get("window");

const categoryIcons: { [key: string]: string } = {
  Salary: "cash-outline",
  Food: "restaurant-outline",
  Transport: "bus-outline",
  Default: "card-outline",
};

const TransactionTimeline = () => {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "transactions"));
        const data: any[] = [];

        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });

        const groupedData = groupTransactionsByDate(data);
        setTransactions(groupedData);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  const groupTransactionsByDate = (transactions: any[]) => {
    const grouped: { [key: string]: any } = {};

    transactions.forEach((tx) => {
      if (!grouped[tx.date]) {
        grouped[tx.date] = { date: tx.date, day: tx.day, items: [] };
      }
      grouped[tx.date].items.push(tx);
    });

    return Object.values(grouped);
  };

  const getBackgroundColor = (amount: number) => {
    if (amount > 0) return "#E8F5E9";
    if (amount < 0 && amount > -30000) return "#FFEBEE";
    return "#FF8A80";
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.date}
          renderItem={({ item }) => (
            <View>
              <View style={styles.dateHeader}>
                <Text style={styles.dateText}>{item.date}</Text>
                <Text style={styles.dayText}>{item.day}</Text>
              </View>

              {item.items.map((tx: any, index: number) => (
                <View key={index} style={styles.transactionRow}>
                  <View style={styles.timeline}>
                    <Ionicons name="ellipse" size={8} color="#FFFFFF" />
                    <View style={styles.line} />
                  </View>

                  <View
                    style={[
                      styles.transactionCard,
                      { backgroundColor: getBackgroundColor(tx.amount) },
                    ]}
                  >
                    <View style={styles.cardLeft}>
                      <View style={styles.iconContainer}>
                        <Ionicons
                          name={categoryIcons[tx.category] || categoryIcons.Default}
                          size={20}
                          color="#555"
                        />
                      </View>
                      <Text style={styles.categoryText}>{tx.category}</Text>
                    </View>

                    <Text
                      style={[
                        styles.amountText,
                        tx.amount > 0 ? styles.income : styles.expense,
                      ]}
                    >
                      {tx.amount > 0
                        ? `+${tx.amount.toLocaleString()}`
                        : tx.amount.toLocaleString()}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  container: {
    width: width * 0.85, // Reduces width to 85% of screen width
    backgroundColor: "#6C3EB7",
    padding: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  dateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    marginBottom: 10,
  },
  dateText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  dayText: {
    color: "#D1C4E9",
    fontSize: 14,
    fontStyle: "italic",
  },
  transactionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  timeline: {
    alignItems: "center",
    marginRight: 12,
    marginTop: 5,
  },
  line: {
    width: 2,
    height: 40,
    backgroundColor: "#FFFFFF80",
    marginTop: 4,
  },
  transactionCard: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  iconContainer: {
    width: 36,
    height: 36,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  amountText: {
    fontSize: 16,
    fontWeight: "700",
  },
  income: {
    color: "#4CAF50",
  },
  expense: {
    color: "#C62828", //red
  },
});

export default TransactionTimeline;