import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import Button from '@/components/Button';
import { useState, useEffect } from 'react';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { resetPassword } from '@/api/auth';

export default function NewPasswordScreen() {
  const { email, verified, code } = useLocalSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState('');
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    // Ensure user has verified their email and has a code
    if (verified !== 'true' || !email || !code) {
      router.replace('/(auth)/forgot-password');
    }
  }, [verified, email, code]);

  const validateInput = () => {
    setErrors('');
    if (!newPassword || !confirmPassword) {
      setErrors('All fields are required');
      return false;
    }

    if (newPassword.length < 6) {
      setErrors('Password must be at least 6 characters long');
      return false;
    }

    if (newPassword !== confirmPassword) {
      setErrors('Passwords do not match');
      return false;
    }

    return true;
  };

  async function updatePassword() {
    if (!email || !code) {
      setErrors('Email or verification code is missing');
      return;
    }

    setLoading(true);
    try {
      // Call the reset password API
      const { success, error } = await resetPassword(
        email.toString(),
        newPassword,
        code.toString()
      );

      if (!success) {
        setErrors(error || 'Failed to update password');
        setLoading(false);
        return;
      }
      
      setCompleted(true);
      
      // Wait a moment before navigating to let the user see the success message
      setTimeout(() => {
        router.push('/(auth)/sign-in');
      }, 3000);
    } catch (error: any) {
      setErrors('An unexpected error occurred. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async () => {
    if (!validateInput()) return;
    await updatePassword();
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Stack.Screen options={{ title: 'Create New Password' }} />
      
      <View style={styles.formContainer}>
        {!completed ? (
          <>
            <Text style={styles.title}>Create New Password</Text>
            <Text style={styles.subtitle}>Choose a new password for your account</Text>
            
            <Text style={styles.label}>New Password</Text>
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Min. 6 characters"
              style={styles.input}
              secureTextEntry
              editable={!loading}
            />

            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              style={styles.input}
              secureTextEntry
              editable={!loading}
            />

            {errors ? <Text style={styles.error}>{errors}</Text> : null}
            
            <Button 
              text={loading ? "Updating..." : "Update Password"} 
              onPress={onSubmit} 
              disabled={loading}
            />
          </>
        ) : (
          <>
            <Text style={styles.title}>Password Updated</Text>
            <Text style={styles.subtitle}>
              Your password has been successfully updated.
            </Text>
            <Text style={styles.instructions}>
              You'll be redirected to the login screen in a moment...
            </Text>
          </>
        )}
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
});