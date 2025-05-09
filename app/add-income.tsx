import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
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
      <Text>Amount:</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={amount} onChangeText={setAmount} />

      <Text>Source:</Text>
      <TextInput style={styles.input} value={source} onChangeText={setSource} />

      <Text>Date:</Text>
      <Button title={date.toDateString()} onPress={() => setShowDatePicker(true)} />

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

      <Button title="Save Income" onPress={saveIncome} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { borderWidth: 1, padding: 8, marginVertical: 10 }
});
