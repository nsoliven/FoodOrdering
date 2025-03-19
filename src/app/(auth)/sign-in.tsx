/*
  Default login page for the app.
*/

import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import Button from '@/components/Button';
import { useState } from 'react';
import Colors from '@/constants/Colors';
import { Stack, Link, router } from 'expo-router';
import supabase from '@/lib/client/supabase';


const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState('');
  const [loading, setLoading] = useState(false);

  const validateInput = () => {
    setErrors('');
    if (!email || !password) {
      setErrors('Email and password are required');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors('Please enter a valid email address');
      return false;
    }

    if (password.length < 6) {
      setErrors('Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrors(error.message);
    } else {
      Alert.alert('Success', 'Logged in successfully');
    }

    setLoading(false);
  }

  const onLogin = async () => {
    if (!validateInput()) return;
    await signInWithEmail();
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Stack.Screen options={{ title: 'Login' }} />
      
      <View style={styles.formContainer}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to your account</Text>
        
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="your@email.com"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Min. 6 characters"
          style={styles.input}
          secureTextEntry
        />

        {errors ? <Text style={styles.error}>{errors}</Text> : null}
        
        <Button 
          text={loading ? "Logging In.." : "Login"} 
          onPress={onLogin} 
          disabled={loading}
        />
        
        <Text style={styles.forgotPassword}>Forgot password?</Text>
        
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <Text onPress={() => {
              router.push('./sign-up');
          }} style={styles.signupLink}>Sign up</Text>
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
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  label: {
    color: 'gray',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  forgotPassword: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginTop: 15,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    color: 'gray',
  },
  signupLink: {
    fontWeight: 'bold',
    color: Colors.light.tint,
  },
});

export default LoginScreen;