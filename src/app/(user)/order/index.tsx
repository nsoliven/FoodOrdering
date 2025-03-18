import { FlatList, Text } from 'react-native';
import OrderListItem from '@components/OrderListItem';

import { useMyOrderList } from '@api/orders';

export default function OrdersScreen() {
  const { data: orders, isLoading, error } = useMyOrderList();
  if (isLoading) return null;
  if (error) return <Text>{error.message}</Text>;
  
  return (
    <FlatList 
      data={orders}
      renderItem={({ item }) => <OrderListItem order={item} />}
      contentContainerStyle={{ gap: 10, padding: 10 }}
    />
  );
}