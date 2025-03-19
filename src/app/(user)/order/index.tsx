import { FlatList, Text, View, StyleSheet } from 'react-native';
import OrderListItem from '@components/OrderListItem';
import { useMyOrderList } from '@api/orders';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo

export default function OrdersScreen() {
  const { data: orders, isLoading, error } = useMyOrderList();
  
  if (isLoading) return <View style={styles.centered}><Text>Loading orders...</Text></View>;
  
  if (error) return (
    <View style={styles.centered}>
      <Text style={styles.errorText}>{error.message}</Text>
    </View>
  );
  
  if (!orders || orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="receipt-outline" size={70} color="#ccc" />
        <Text style={styles.emptyTitle}>No Orders Found</Text>
        <Text style={styles.emptyText}>
          You haven't placed any orders yet.
        </Text>
      </View>
    );
  }
  
  return (
    <FlatList 
      data={orders}
      renderItem={({ item }) => <OrderListItem order={item} />}
      contentContainerStyle={{ gap: 10, padding: 10 }}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    maxWidth: '80%',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  }
});
