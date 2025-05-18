import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function AddIncome() {
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const saveIncome = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const db = getFirestore();
      const incomeRef = collection(db, 'users', user.uid, 'income');
      await addDoc(incomeRef, {
        amount: parseFloat(amount),
        source,
        date
      });

      const transactionsRef = collection(db, 'transactions');
      await addDoc(transactionsRef, {
        amount: parseFloat(amount),
        category: source,
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'long' }),
        backgroundColor: '#DFFFD6'
      });

      alert('Income saved!');
    } else {
      alert('User not logged in');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Income</Text>

      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        placeholder="Enter amount"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Source</Text>
      <TextInput
        style={styles.input}
        value={source}
        onChangeText={setSource}
        placeholder="e.g., Salary, Freelance"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Date</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
        <Text style={styles.dateButtonText}>{date.toDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <TouchableOpacity onPress={saveIncome} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Income</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#5B2C82',
  },
  header: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  dateButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#5B2C82',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
  },
  saveButtonText: {
    color: '#4CAF50',
    fontWeight: '600',
    fontSize: 16,
  },
});
