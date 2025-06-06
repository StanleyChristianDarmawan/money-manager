import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function AddIncome() {
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const saveIncome = async () => {
    if (!amount || !source) {
      alert('Please fill all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const db = getFirestore();
        const incomeRef = collection(db, 'users', user.uid, 'income');
        await addDoc(incomeRef, {
          amount: parseFloat(amount),
          source,
          date,
          createdAt: new Date()
        });

        const transactionsRef = collection(db, 'transactions');
        await addDoc(transactionsRef, {
          amount: parseFloat(amount),
          category: source,
          date: date.toISOString().split('T')[0],
          day: date.toLocaleDateString('en-US', { weekday: 'long' }),
          type: 'income',
          backgroundColor: '#DFFFD6',
          userId_creator: user.uid
        });

        setAmount('');
        setSource('');
        alert('Income saved successfully!');
      } else {
        alert('Please sign in to continue');
      }
    } catch (error) {
      console.error("Error saving income:", error);
      alert('Failed to save income');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LinearGradient
      colors={['#1A1128', '#2A1B3D']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerText}>Add New Income</Text>

        <View style={styles.card}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Amount</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor="#B0B0B0"
                selectionColor="#8A52E5"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Income Source</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="pricetag-outline" size={20} color="#8A52E5" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={source}
                onChangeText={setSource}
                placeholder="Salary, Bonus, etc."
                placeholderTextColor="#B0B0B0"
                selectionColor="#8A52E5"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.dateButton}
              activeOpacity={0.8}
            >
              <Ionicons name="calendar-outline" size={20} color="#8A52E5" />
              <Text style={styles.dateText}>{date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}</Text>
              <Ionicons name="chevron-down" size={18} color="#8A52E5" />
            </TouchableOpacity>
          </View>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="spinner"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
            textColor="#FFFFFF"
            themeVariant="dark"
          />
        )}

        <TouchableOpacity
          onPress={saveIncome}
          style={styles.saveButton}
          disabled={isSubmitting}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={22} color="#FFF" />
              <Text style={styles.saveButtonText}>Save Income</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  headerText: {
    fontSize: 22,
    color: '#FFF',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#D1C4E9',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(138, 82, 229, 0.3)',
  },
  inputIcon: {
    marginRight: 12,
  },
  currencySymbol: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
    paddingVertical: 14,
    fontWeight: '500',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(138, 82, 229, 0.3)',
  },
  dateText: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '500',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8A52E5',
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: '#8A52E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    gap: 10,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
