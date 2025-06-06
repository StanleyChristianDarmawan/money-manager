import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function GenerateBudgetPage() {
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async () => {
    if (!userInput.trim()) {
      alert('Please enter your financial concerns');
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const response = await fetch('https://money-manager-api-two.vercel.app/api/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput }),
      });
      const json = await response.json();
      setResult(json);
    } catch (err) {
      console.error(err);
      alert('Failed to generate budget. Please try again.');
    }
    setLoading(false);
  };

  return (
    <LinearGradient
      colors={['#1A1128', '#2A1B3D']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerText}>Generate Budget</Text>

        <View style={styles.card}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Financial Concerns</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="document-text-outline" size={20} color="#8A52E5" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Masukkan keluhan finansial kamu..."
                placeholderTextColor="#B0B0B0"
                multiline
                value={userInput}
                onChangeText={setUserInput}
                selectionColor="#8A52E5"
                textAlignVertical="top"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.generateButton}
          onPress={handleGenerate}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Ionicons name="sparkles-outline" size={22} color="#FFF" />
              <Text style={styles.generateButtonText}>Generate Budget</Text>
            </>
          )}
        </TouchableOpacity>

        {result && (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 500 }}
            style={styles.resultCard}
          >
            <Text style={styles.resultTitle}>Budget Summary</Text>
            
            <View style={styles.summaryContainer}>
              <View style={styles.summaryItem}>
                <Ionicons name="trending-up" size={20} color="#4CAF50" />
                <Text style={styles.summaryLabel}>Income</Text>
                <Text style={styles.summaryValue}>Rp {result.totalIncome.toLocaleString()}</Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Ionicons name="wallet" size={20} color="#8A52E5" />
                <Text style={styles.summaryLabel}>Saving Target</Text>
                <Text style={styles.summaryValue}>Rp {result.targetSaving.toLocaleString()}</Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Ionicons name="card" size={20} color="#FF6B6B" />
                <Text style={styles.summaryLabel}>Spending</Text>
                <Text style={styles.summaryValue}>Rp {result.estimatedSpending.toLocaleString()}</Text>
              </View>
            </View>

            <View style={styles.adviceContainer}>
              <Ionicons name="bulb" size={20} color="#FFD700" />
              <Text style={styles.adviceText}>{result.advice}</Text>
            </View>

            <Text style={styles.categoriesTitle}>Budget Categories</Text>
            {result.categories.map((cat: any, idx: number) => (
              <MotiView
                key={idx}
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: 300 + idx * 100 }}
                style={styles.categoryCard}
              >
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryTitle}>{cat.title}</Text>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{cat.category}</Text>
                  </View>
                </View>
                
                <View style={styles.categoryDetails}>
                  <View style={styles.categoryDetailItem}>
                    <Ionicons name="cash" size={16} color="#4CAF50" />
                    <Text style={styles.categoryDetailText}>Rp {cat.amount.toLocaleString()}</Text>
                  </View>
                  <View style={styles.categoryDetailItem}>
                    <Ionicons name="flag" size={16} color="#8A52E5" />
                    <Text style={styles.categoryDetailText}>{cat.priority} Priority</Text>
                  </View>
                </View>
              </MotiView>
            ))}
          </MotiView>
        )}
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
    paddingTop: 60,
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
    marginBottom: 4,
  },
  label: {
    color: '#D1C4E9',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(138, 82, 229, 0.3)',
    minHeight: 100,
  },
  inputIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  textInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
    minHeight: 80,
  },
  generateButton: {
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
    marginBottom: 24,
  },
  generateButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 20,
  },
  resultTitle: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  summaryContainer: {
    marginBottom: 20,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  summaryLabel: {
    flex: 1,
    color: '#D1C4E9',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 12,
  },
  summaryValue: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  adviceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  adviceText: {
    flex: 1,
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 12,
    lineHeight: 20,
  },
  categoriesTitle: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: '600',
    marginBottom: 16,
  },
  categoryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(138, 82, 229, 0.2)',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  categoryTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: 'rgba(138, 82, 229, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  categoryBadgeText: {
    color: '#D1C4E9',
    fontSize: 12,
    fontWeight: '500',
  },
  categoryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDetailText: {
    color: '#D1C4E9',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
});