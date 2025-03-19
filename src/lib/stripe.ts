import { Alert } from "react-native";
import supabase from "./supabase";
import { initPaymentSheet, presentPaymentSheet } from "@stripe/stripe-react-native";

const fetchPaymentSheetParams = async (amount: number) => {
  try {
    const {data, error} = await supabase.functions.invoke('payment-sheet', {
      body: { amount },
    });

    if(error) {
      Alert.alert('Error', error.message || 'An error occurred while fetching payment parameters.');
      return null;
    }

    if(!data || !data.paymentIntent) {
      Alert.alert('Error', 'Invalid response from server. Payment intent is missing.');
      return null;
    }

    return {
      paymentIntent: data.paymentIntent,
      publishableKey: data.publishableKey,
      customer: data.customer,
      ephemeralKey: data.ephemeralKey
    };
  } catch (e) {
    Alert.alert('Error', 'An unexpected error occurred while preparing payment.');
    return null;
  }
};

export const initializePaymentSheet = async (amount: number) => {
  const paymentSheetParams = await fetchPaymentSheetParams(amount);
  if (!paymentSheetParams) {
    Alert.alert('Error', 'Failed to fetch payment parameters.');
    return false;
  }
  const { paymentIntent, publishableKey, customer, ephemeralKey } = paymentSheetParams;
  
  
  if (!paymentIntent || !publishableKey || !customer || !ephemeralKey) {
    Alert.alert('Error', 'Failed to fetch payment parameters.');
    return false;
  }

  try {
    const { error } = await initPaymentSheet({
      merchantDisplayName: 'Example, Inc.',
      paymentIntentClientSecret: paymentIntent,
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      defaultBillingDetails: {
        name: 'Jane Doe'
      }
    });
    
    if (error) {
      Alert.alert('Error', error.message || 'Failed to initialize payment.');
      return false;
    }
    
    return true;
  } catch (e) {
    Alert.alert('Error', 'An unexpected error occurred while initializing payment.');
    return false;
  }
};

export const openPaymentSheet = async () => {
  try {
    const { error } = await presentPaymentSheet();
    if(error) {
      Alert.alert('Payment Failed', error.message || 'An error occurred while processing your payment.');
      return false;
    }
    
    Alert.alert('Success', 'Your payment was processed successfully!');
    return true;
  } catch (e) {
    Alert.alert('Error', 'An unexpected error occurred during payment.');
    return false;
  }
}
