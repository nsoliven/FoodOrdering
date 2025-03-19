import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Order, Profile, Tables } from '@src/types';
import supabase from '@lib/client/supabase';

import { OrderStatus, } from '@src/types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Can use this function below or use Expo's Push Notification Tool from: https://expo.dev/notifications
async function sendPushNotification(
  expoPushToken: Notifications.ExpoPushToken,
  title: string = 'Order Status Updated',
  body: string = 'Your order status has been updated!',
) {
  // The token needs to be a string, not an object
  const tokenString = typeof expoPushToken === 'string' 
    ? expoPushToken 
    : expoPushToken.data;

  const message = {
    to: tokenString,
    sound: 'default',
    title: title,
    body: body,
    data: { someData: 'goes here' },
  };

  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
    
    const responseData = await response.json();
    console.log('Push notification response:', responseData);
    
    if (!response.ok) {
      throw new Error(`Push notification failed: ${JSON.stringify(responseData)}`);
    }
    
    return responseData;
  } catch (error) {
    console.error('Error sending push notification:', error);
    throw error;
  }
}

export async function registerForPushNotificationsAsync(): Promise<Notifications.ExpoPushToken | undefined> {
  let token: Notifications.ExpoPushToken | undefined;

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return undefined;
    }
    
    const response = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas.projectId,
    });
      token = response;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
    return undefined;
  }

  return token;
}

const getUserPushToken = async (user_id: string) => { 
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('expo_push_token')
    .eq('id', user_id)
    .single();

  if (error) {
    console.error('Failed to fetch push token:', error);
    return null;
  }

  return data?.expo_push_token || null;
}

export const notifyUserAboutOrderUpdate = async (order: Tables<'orders'>, status: OrderStatus) => { 
  const tokenString = await getUserPushToken(order.user_id);
  if (tokenString) {
    // Convert string token to ExpoPushToken object
    const expoPushToken = { data: tokenString } as Notifications.ExpoPushToken;

    if (status === 'New') {
      await sendPushNotification(
        expoPushToken,
        'Order has been marked as New',
        `Your order #${order.id} has been received!`,
      );
    }
    if (status === 'Cooking') {
      await sendPushNotification(
        expoPushToken,
        'Order is Cooking',
        `Your order #${order.id} is now being prepared!`,
      );
    }
    if (status === 'Delivering') {
      await sendPushNotification(
        expoPushToken,
        'Order is Delivering',
        `Your order #${order.id} is on its way!`,
      );
    }
    if (status === 'Delivered') {
      await sendPushNotification(
        expoPushToken,
        'Order has been Delivered',
        `Your order #${order.id} has been delivered!`,
      );
    }

    console.log('Push notification sent to user:', order.user_id, 'with token:', tokenString);
  } else {
    console.error('No push token available for user:', order.user_id);
  }
}