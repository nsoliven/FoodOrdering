import { FlatList, Text} from 'react-native';
import OrderListItem from '@components/OrderListItem';
import { useAdminOrderList, useInsertOrder } from '@api/orders';
import { useEffect } from 'react';
import supabase from '@lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { useOrdersSubscription } from '@api/orders/subscriptions';

export default function OrdersScreen() {
  const { data: orders, isLoading, error } = useAdminOrderList({archived: false});
  useOrdersSubscription();
  if (isLoading) return null;
  if (error) return <Text>{error.message}</Text>;

  return (
    <FlatList 
      data={orders}
      renderItem={({ item }) => <OrderListItem order={item} />}
      contentContainerStyle={{ gap: 10, padding: 10 }}
      keyExtractor={(item) => item.id.toString()}
    />
  );
}