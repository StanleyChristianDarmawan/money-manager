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
                  <Ionicons name="ellipse" size={8} color="white" />
                  <View style={styles.line} />
                </View>

                <View style={[styles.transactionCard, { backgroundColor: tx.backgroundColor }]}>
                  <Text style={styles.categoryText}>{tx.category}</Text>
                  <Text
                    style={[
                      styles.amountText,
                      tx.amount > 0 ? styles.income : styles.expense,
                    ]}
                  >
                    {tx.amount > 0 ? `+${tx.amount.toLocaleString()}` : `${tx.amount.toLocaleString()}`}
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
    backgroundColor: "#5B2C82",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  dateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  dateText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  dayText: {
    color: "#C4C4C4",
    fontSize: 14,
  },
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  timeline: {
    alignItems: "center",
    marginRight: 10,
  },
  line: {
    width: 2,
    height: 30,
    backgroundColor: "white",
    marginVertical: 2,
  },
  transactionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    flex: 1,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  categoryText: {
    color: "#333",
    flex: 1,
    fontSize: 14,
  },
  amountText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  income: {
    color: "green",
  },
  expense: {
    color: "red",
  },
});

export default TransactionTimeline;
