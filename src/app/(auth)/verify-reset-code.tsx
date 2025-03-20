import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import Button from '@/components/Button';
import { useState } from 'react';
import Colors from '@/constants/Colors';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import supabase from '@/lib/client/supabase';

const VerifyResetCodeScreen = () => {
  const { email } = useLocalSearchParams();
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState('');
  const [loading, setLoading] = useState(false);

  const validateInput = () => {
    setErrors('');
    if (!code) {
      setErrors('Verification code is required');
      return false;
    }

    if (code.length !== 6 || !/^\d+$/.test(code)) {
      setErrors('Please enter a valid 6-digit code');
      return false;
    }

    return true;
  };

  async function verifyCode() {
    if (!email) {
      setErrors('Email address is missing');
      return;
    }

    setLoading(true);
    try {
      // Verify the code against our database
      const { data, error } = await supabase
        .from('password_reset_codes')
        .select('*')
        .eq('email', email.toString().toLowerCase())
        .eq('code', code)
        .single();

      if (error || !data) {
        setErrors('Invalid verification code. Please try again.');
        setLoading(false);
        return;
      }

      // Check if code is expired
      if (new Date(data.expires_at) < new Date()) {
        setErrors('This verification code has expired. Please request a new one.');
        setLoading(false);
        return;
      }

      // Code is valid, redirect to reset password screen
      router.push({
        pathname: '/(auth)/new-password',
        params: { 
          email: email.toString(), 
          verified: 'true',
          code: code
        }
      });
    } catch (error) {
      setErrors('An unexpected error occurred. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async () => {
    if (!validateInput()) return;
    await verifyCode();
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Stack.Screen options={{ title: 'Verify Code' }} />
      
      <View style={styles.formContainer}>
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to {email}
        </Text>
        
        <Text style={styles.label}>Verification Code</Text>
        <TextInput
          value={code}
          onChangeText={setCode}
          placeholder="6-digit code"
          style={styles.input}
          keyboardType="number-pad"
          maxLength={6}
          editable={!loading}
        />

        {errors ? <Text style={styles.error}>{errors}</Text> : null}
        
        <Button 
          text={loading ? "Verifying..." : "Verify Code"} 
          onPress={onSubmit} 
          disabled={loading}
        />
        
        <View style={styles.backContainer}>
          <Text 
            onPress={() => router.push('/(auth)/forgot-password')} 
            style={styles.backLink}
          >
            Request New Code
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 30,
    alignSelf: 'center',
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 5,
  },
  label: {
    color: 'gray',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  backContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  backLink: {
    fontWeight: 'bold',
    color: Colors.light.tint,
  },
});

export default VerifyResetCodeScreen;