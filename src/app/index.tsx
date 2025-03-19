import { View, Text, ActivityIndicator, StyleSheet, SafeAreaView, Pressable, Alert } from 'react-native';
import Button from '@/components/Button';
import { Link, Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

import { useAuth } from '@/providers/AuthProvider';
import supabase from '@/lib/client/supabase';

const Index = () => {
  const { session, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
      </View>
    );
  }
  
  if (!session) return <Redirect href={'/(auth)/sign-in'} />;
  if (!isAdmin) return <Redirect href={'/(user)'} />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Food Ordering Admin</Text>
        <Text style={styles.subtitle}>Welcome! Select a mode to continue</Text>
      </View>

      <View style={styles.cardsContainer}>
        <Link href={'/(user)'} asChild>
          <Pressable style={styles.card}>
            <View style={[styles.iconContainer, { backgroundColor: '#4CAF50' }]}>
              <Ionicons name="person-outline" size={34} color="#fff" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>User Mode</Text>
              <Text style={styles.cardDescription}>Browse menu and place orders as a regular user</Text>
            </View>
          </Pressable>
        </Link>

        <Link href={'/(admin)'} asChild>
          <Pressable style={styles.card}>
            <View style={[styles.iconContainer, { backgroundColor: '#2196F3' }]}>
              <Ionicons name="settings-outline" size={34} color="#fff" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Admin Mode</Text>
              <Text style={styles.cardDescription}>Manage products and orders</Text>
            </View>
          </Pressable>
        </Link>
      </View>

      <View style={styles.footer}>
        <Button 
          onPress={() => 
            Alert.alert(
              "Sign Out",
              "Are you sure you want to sign out?",
              [
                { text: "Cancel", style: "cancel" },
                { 
                  text: "Sign Out", 
                  onPress: async () => {
                    try {
                      await supabase.auth.signOut();
                    } catch (error) {
                      console.error('Error signing out:', error instanceof Error ? error.message : error);
                    }
                  }
                }
              ]
            )
          }
          text="Sign Out" 
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    flexDirection: 'column',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginTop: 60,
    marginBottom: 30,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.light.tint,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    color: 'gray',
    textAlign: 'center',
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    marginLeft: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 14,
    color: 'gray',
    marginTop: 4,
  },
  buttonContainer: {
    marginBottom: 10,
  },
  footer: {
    paddingVertical: 20,
    marginBottom: 10,
  },
});

export default Index;