import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import LottieView from 'lottie-react-native';

export default function App() {
  const [budget, setBudget] = useState('');
  const [days, setDays] = useState('');
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const huggingFaceAPIKey = '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';
  
  const handleGeneratePlan = async () => {
    setLoading(true);
    setError('');
    
    try {
      const prompt = `User has a total budget of ${budget} and needs a budget plan for ${days} days. Suggest reasonable daily expenses.`

      const response = await axios.post(
        'https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf',
        { inputs: prompt },
        {
          headers: {
            Authorization: `Bearer ${huggingFaceAPIKey}`,
          },
        }
      );

      setPlan(response.data[0]?.generated_text || 'No plan generated.');
    } catch (error) {
      setError('Error generating plan. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={budget}
        onChangeText={setBudget}
        keyboardType="numeric"
        placeholder="Enter your total budget"
      />
      <TextInput
        style={styles.input}
        value={days}
        onChangeText={setDays}
        keyboardType="numeric"
        placeholder="Enter number of days"
      />
      <Button title="Generate Plan" onPress={handleGeneratePlan} />
      
      {loading ? (
        <LottieView
          source={require('../assets/loading-animation.json')}
          autoPlay
          loop
          style={styles.loadingAnimation}
        />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <Text style={styles.planText}>{plan}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  planText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    color: 'green',
  },
  errorText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    color: 'red',
  },
  loadingAnimation: {
    width: 100,
    height: 100,
    marginTop: 20,
  },
});
