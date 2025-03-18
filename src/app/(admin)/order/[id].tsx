import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router';
import orders from '@assets/data/orders';
import OrderItemListItem from '@components/OrderItemListItem';
import OrderStatusList from '@components/OrderStatusList';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import Colors from '@constants/Colors';

import { OrderStatusList as OrderStatusListTypes } from '@src/types';
import { useOrderDetails } from '@api/orders';

export default function OrderDetailScreen() {
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === 'string' ? idString : idString[0]);

  const { data: order, isLoading, error } = useOrderDetails(id);
  
  if (isLoading) return <ActivityIndicator />;
  if (error || !order ) return <Text>There was an error loading the order.</Text>;

  console.log('order', order);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Order #${order.id}` }} />
      
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Order Details</Text>
        <Text style={styles.date}>{dayjs(order.created_at).format('MMM D, YYYY h:mm A')}</Text>
      </View>

      <OrderStatusList status={order.status} />

      <Text style={styles.sectionTitle}>Items</Text>
      <FlatList
        data={order.order_items}
        renderItem={({ item }) => <OrderItemListItem item={item} />}
        contentContainerStyle={{ gap: 10, padding: 10 }}
        ListFooterComponent={() => (
          <>
            <Text style={{ fontWeight: 'bold' }}>Status</Text>
            <View style={{ flexDirection: 'row', gap: 5 }}>
              {OrderStatusListTypes.map((status) => (
                <Pressable
                  key={status}
                  onPress={() => console.warn('Update status')}
                  style={{
                    borderColor: Colors.light.tint,
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 5,
                    marginVertical: 10,
                    backgroundColor:
                      order.status === status
                        ? Colors.light.tint
                        : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      color:
                        order.status === status ? 'white' : Colors.light.tint,
                    }}
                  >
                    {status}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
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