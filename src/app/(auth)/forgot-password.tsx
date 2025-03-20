import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import Button from '@/components/Button';
import { useState } from 'react';
import Colors from '@/constants/Colors';
import { Stack, router } from 'expo-router';
import supabase from '@/lib/client/supabase';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateInput = () => {
    setErrors('');
    if (!email) {
      setErrors('Email is required');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors('Please enter a valid email address');
      return false;
    }

    return true;
  };

  async function sendResetCode() {
    setLoading(true);
    try {
      // Generate a random 6-digit code
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store the code in a secure table with the user's email and expiration time
      const { error: dbError } = await supabase
        .from('password_reset_codes')
        .upsert([
          { 
            email: email.toLowerCase(), 
            code: resetCode,
            created_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 30 * 60000).toISOString() // 30 minutes expiry
          }
        ], { onConflict: 'email' });

      if (dbError) {
        setErrors('Unable to process request. Please try again.');
        console.error('DB Error:', dbError);
        setLoading(false);
        return;
      }

      // Send the email with the code
      // Note: In a real app, you'd use a server function or email service
      // For simplicity, we'll just assume the email is sent and show the next screen
      
      setSubmitted(true);
    } catch (error) {
      setErrors('An unexpected error occurred. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async () => {
    if (!validateInput()) return;
    await sendResetCode();
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Stack.Screen options={{ title: 'Forgot Password' }} />
      
      <View style={styles.formContainer}>
        {!submitted ? (
          <>
            <Text style={styles.title}>Reset Your Password</Text>
            <Text style={styles.subtitle}>Enter your email to receive a verification code</Text>
            
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />

            {errors ? <Text style={styles.error}>{errors}</Text> : null}
            
            <Button 
              text={loading ? "Sending..." : "Send Verification Code"} 
              onPress={onSubmit} 
              disabled={loading}
            />
          </>
        ) : (
          <>
            <Text style={styles.title}>Check Your Email</Text>
            <Text style={styles.subtitle}>
              We've sent a verification code to {email}
            </Text>
            <Text style={styles.instructions}>
              Please check your inbox for the 6-digit code.
              If you don't see the email, check your spam folder.
            </Text>
            <Button 
              text="Enter Verification Code" 
              onPress={() => router.push({
                pathname: '/(auth)/verify-reset-code',
                params: { email }
              })} 
            />
          </>
        )}
        
        <View style={styles.backContainer}>
          <Text 
            onPress={() => router.back()} 
            style={styles.backLink}
          >
            Back to Login
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
  instructions: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 22,
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
  backContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  backLink: {
    fontWeight: 'bold',
    color: Colors.light.tint,
  },
});

export default ForgotPasswordScreen;