import { registerForPushNotificationsAsync } from '@lib/notifications';
import { ExpoPushToken } from 'expo-notifications';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import supabase from '@lib/supabase';
import { useAuth } from './AuthProvider';

const NotificationProvider = ({ children }: PropsWithChildren) => {
  const [expoPushToken, setExpoPushToken] = useState<
    ExpoPushToken | undefined
  >();
  const [notification, setNotification] =
    useState<Notifications.Notification>();
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  const { profile, loading } = useAuth();

  const savePushToken = async (token: ExpoPushToken | undefined) => {
    setExpoPushToken(token);

    if(!token || !profile) {
      console.log('Missing token or profile, cannot save');
      return;
    }

    try {
      const tokenString = String(token.data);
      console.log('Token:', tokenString);
      console.log('Profile:', profile);

      const { data, error } = await supabase
        .from('profiles')
        .update({ expo_push_token: tokenString })
        .eq('id', profile.id);
      
      if (error) {
        console.error('Failed to update profile with push token:', error);
      } else {
        console.log('Profile updated successfully:', data);
      }
    } catch (e) {
      console.error('Exception while saving push token:', e);
    }
  }

  // Register for notifications when authentication is complete
  useEffect(() => {
    // Only proceed if not loading and profile exists
    if (!loading && profile) {
      console.log('Auth loaded, profile available - registering for notifications');
      registerForPushNotificationsAsync().then((token) =>
        savePushToken(token),
      );
    } else if (loading) {
      console.log('Still loading auth data, waiting...');
    } else if (!profile) {
      console.log('Auth loaded but no profile found');
    }
    
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [loading, profile]); // Include both loading and profile as dependencies

  return <>{children}</>;
};

export default NotificationProvider;