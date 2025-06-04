import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function GenerateBudgetPage() {
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch('http://localhost:3005/generate-budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput }),
      });
      const json = await response.json();
      setResult(json);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Generate Budget</Text>

      <TextInput
        style={styles.input}
        placeholder="Masukkan keluhan finansial kamu..."
        multiline
        value={userInput}
        onChangeText={setUserInput}
      />

      <TouchableOpacity style={styles.button} onPress={handleGenerate} disabled={loading}>
        <Ionicons name="sparkles-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>Generate</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 20 }} />}

      {result && (
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500 }}
          style={styles.resultContainer}
        >
          <Text style={styles.resultText}>Income: Rp {result.totalIncome.toLocaleString()}</Text>
          <Text style={styles.resultText}>Saving Target: Rp {result.targetSaving.toLocaleString()}</Text>
          <Text style={styles.resultText}>Spending: Rp {result.estimatedSpending.toLocaleString()}</Text>
          <Text style={styles.advice}>💡 {result.advice}</Text>

          {result.categories.map((cat: any, idx: number) => (
            <MotiView
              key={idx}
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 300 + idx * 100 }}
              style={styles.categoryBox}
            >
              <Text style={styles.catTitle}>{cat.title} ({cat.category})</Text>
              <Text>Amount: Rp {cat.amount.toLocaleString()}</Text>
              <Text>Priority: {cat.priority}</Text>
            </MotiView>
          ))}
        </MotiView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 60, },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    marginTop: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: '#fff', marginLeft: 8, fontWeight: 'bold' },
  resultContainer: { marginTop: 30 },
  resultText: { fontSize: 16, marginBottom: 5 },
  advice: { marginTop: 10, fontStyle: 'italic', color: '#555' },
  categoryBox: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
  },
  catTitle: { fontWeight: 'bold', marginBottom: 5 },
});
