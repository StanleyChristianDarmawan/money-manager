import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function AddExpense() {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const saveExpense = async () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Invalid amount', 'Please enter a valid positive amount.');
      return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        Alert.alert('Error', 'User not logged in');
        return;
      }

      const db = getFirestore();

      // Save to user-specific expenses
      const expensesRef = collection(db, 'users', user.uid, 'expenses');
      await addDoc(expensesRef, {
        amount: parsedAmount,
        category,
        date
      });

      // Save to global transactions (as negative value)
      const transactionsRef = collection(db, 'transactions');
      await addDoc(transactionsRef, {
        amount: -parsedAmount, // Make it negative
        category,
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'long' }),
        backgroundColor: '#fc6153'
      });

      Alert.alert('Success', 'Expense saved!');
      setAmount('');
      setCategory('');
    } catch (error) {
      console.error('Error saving expense:', error);
      Alert.alert('Error', 'Something went wrong while saving.');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Amount:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <Text>Category:</Text>
      <TextInput
        style={styles.input}
        value={category}
        onChangeText={setCategory}
      />

      <Text>Date:</Text>
      <Button title={date.toDateString()} onPress={() => setShowDatePicker(true)} />

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setDate(selectedDate);
            }
          }}
        />
      )}

      <Button title="Save Expense" onPress={saveExpense} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { borderWidth: 1, padding: 8, marginVertical: 10 }
});
