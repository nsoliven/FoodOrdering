import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router';
import OrderItemListItem from '@/components/OrderItemListItem';
import OrderStatusList from '@/components/OrderStatusList';
import dayjs from 'dayjs';
import Colors from '@/constants/Colors';

import { OrderStatus, OrderStatusList as OrderStatusListTypes } from '@/types';
import { useOrderDetails, useUpdateOrder } from '@/api/orders';
import { useUpdateOrderSubscription } from '@/api/orders/subscriptions';
import { notifyUserAboutOrderUpdate } from '@/lib/client/notifications';

export default function OrderDetailScreen() {
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === 'string' ? idString : idString[0]);

  const { data: order, isLoading, error } = useOrderDetails(id);
  const { mutate: updateOrder } = useUpdateOrder();

  useUpdateOrderSubscription(id);

  const updateStatus = (status: OrderStatus) => {
    Alert.alert(
      'Update Order Status',
      `Are you sure you want to update the order status to ${status}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: async () => {
            if (status !== order?.status) {
              updateOrder({
                id,
                updatedFields: { status }
              }, {
                onSuccess: () => {
                  if (order) notifyUserAboutOrderUpdate(order, status);
                }
              });
            }
          },
        },
      ],
      { cancelable: true }
    );
  }
  
  if (isLoading) return <ActivityIndicator />;
  if (error || !order ) return <Text>There was an error loading the order.</Text>;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Order #${order.id}` }} />
      
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Order Details</Text>
        <Text style={styles.date}>{dayjs(order.created_at).format('MMM D, YYYY h:mm A')}</Text>
      </View>

      <OrderStatusList status={order.status as OrderStatus} onStatusChange={updateStatus} />
      <Text style={styles.sectionTitle}>Items</Text>
      <FlatList
        data={order.order_items}
        renderItem={({ item }) => <OrderItemListItem item={item} />}
        contentContainerStyle={{ gap: 10, padding: 10 }}
      />

      <View style={styles.footer}>
        <Text style={styles.total}>Total: ${order.total.toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  headerContainer: {
    marginVertical: 10,
    gap: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  date: {
    color: 'gray',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 5,
    marginHorizontal: 10,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
    paddingHorizontal: 10,
    marginTop: 'auto',
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.tint,
  },
});