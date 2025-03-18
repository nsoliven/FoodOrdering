import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import Button from '@components/Button';
import { useState } from 'react';
import Colors from '@constants/Colors';
import { router, Stack } from 'expo-router';

import supabase from '@lib/supabase';


const SignUpScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState('');

  const validateInput = () => {
    setErrors('');
    if (!name || !email || !password || !confirmPassword) {
      setErrors('All fields are required');
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

    if (password !== confirmPassword) {
      setErrors('Passwords do not match');
      return false;
    }

    return true;
  };

  async function signUpWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrors(error.message);
    } else {
      Alert.alert('Success', 'Account created successfully');
    }
    setLoading(false);
  }

  const onSignUp = async () => {
    if (!validateInput()) {
      return;
    }
    await signUpWithEmail();
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Stack.Screen options={{ title: 'Sign Up' }} />
      
      <View style={styles.formContainer}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>
        
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="John Doe"
          style={styles.input}
          autoCapitalize="words"
        />

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

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm password"
          style={styles.input}
          secureTextEntry
        />

        {errors ? <Text style={styles.error}>{errors}</Text> : null}
        
        <Button 
          text={loading ? "Creating Account.." : "Sign Up"} 
          onPress={onSignUp} 
          disabled={loading}
        />
        
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <Text onPress={() => {
              router.push('./');
          }} style={styles.loginLink}>Login</Text>
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: 'gray',
  },
  loginLink: {
    fontWeight: 'bold',
    color: Colors.light.tint,
  },
});

export default SignUpScreen;