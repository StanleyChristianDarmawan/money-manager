import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

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

  return (
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
                      { backgroundColor: tx.backgroundColor || "#FFF" },
                    ]}
                  >
                    <Text style={styles.categoryText}>{tx.category}</Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#6C3EB7",
    padding: 16,
    borderRadius: 16,
    marginTop: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  dateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#7E57C2",
    marginBottom: 6,
  },
  dateText: {
    color: "#FFFFFF",
    fontSize: 16,
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
    marginBottom: 14,
  },
  timeline: {
    alignItems: "center",
    marginRight: 12,
  },
  line: {
    width: 2,
    height: 36,
    backgroundColor: "#FFFFFF80", // white with opacity
    marginTop: 4,
  },
  transactionCard: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  categoryText: {
    color: "#333",
    fontSize: 15,
    fontWeight: "600",
  },
  amountText: {
    fontSize: 15,
    fontWeight: "700",
  },
  income: {
    color: "#4CAF50", // green
  },
  expense: {
    color: "#E53935", // red
  },
});


export default TransactionTimeline;
