import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Alert, ScrollView, Pressable } from 'react-native';
import Button from '@components/Button';
import supabase from '@lib/supabase';
import Colors from '@constants/Colors';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  interface UserProfile {
    id: string;
    email: string;
    last_sign_in_at: string;
    profile?: {
      avatar_url?: string | null;
      full_name?: string | null;
      group?: string;
      id?: string;
      updated_at?: string | null;
      username?: string | null;
      website?: string | null;
    };
  }
  
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showUserId, setShowUserId] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Optionally fetch additional profile data from a profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (data) {
          setUser({ 
            id: user.id, 
            email: user.email || '', 
            last_sign_in_at: user.last_sign_in_at || '', 
            profile: data 
          });
        } else {
          setUser({ 
            id: user.id, 
            email: user.email || '', 
            last_sign_in_at: user.last_sign_in_at || '', 
            profile: undefined 
          });
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', 
        error instanceof Error ? error.message : error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: async () => {
            try {
              setLoggingOut(true);
              await supabase.auth.signOut();
            } catch (error) {
              console.error('Error logging out:', error instanceof Error ? error.message : error);
              Alert.alert("Error", "Failed to log out. Please try again.");
            } finally {
              setLoggingOut(false);
            }
          }
        }
      ]
    );
  };

  const toggleUserIdVisibility = () => {
    setShowUserId(prevState => !prevState);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>
      
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          {user?.profile?.avatar_url ? (
            <Image 
              source={{ uri: user.profile.avatar_url }} 
              style={styles.avatar} 
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={40} color="#ffffff" />
            </View>
          )}
        </View>
        
        <Text style={styles.name}>{user?.profile?.full_name || user?.email || 'User'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>User ID</Text>
          <View style={styles.userIdContainer}>
            <Text style={styles.infoValue}>
              {showUserId ? user?.id : '*************'}
            </Text>
            <Pressable onPress={toggleUserIdVisibility} style={styles.revealButton}>
              <Ionicons 
                name={showUserId ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color={Colors.light.tint} 
              />
            </Pressable>
          </View>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Last Sign In</Text>
          <Text style={styles.infoValue}>
            {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}
          </Text>
        </View>
      </View>
      
      <View style={styles.actionsContainer}>        
        <Button
          text={loggingOut ? "Logging out..." : "Logout"}
          onPress={handleLogout}
          style={styles.logoutButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.light.tint,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    marginBottom: 10,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: Colors.light.tint,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'left',
  },
  userIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '70%',
    marginRight: 10,
  },
  revealButton: {
    marginLeft: 10,
  },
  actionsContainer: {
    padding: 10,
  },
  logoutButton: {
    backgroundColor: '#ff5252',
  },
});

export default ProfileScreen;
