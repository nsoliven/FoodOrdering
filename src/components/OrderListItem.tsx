import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Tables } from '@src/types';
import { Link, useSegments } from 'expo-router';
import Colors from '@constants/Colors';
import dayjs from 'dayjs';

type OrderListItemProps = {
  order: Tables<'orders'>;
};

const OrderListItem = ({ order }: OrderListItemProps) => {

  // routing fix
  const segments = useSegments();
  const isAdmin = segments[0] == '(admin)';

  return (
    <Link href={ isAdmin ? `../../order/${order.id}` : `./order/${order.id}`} asChild>
      <Pressable style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.orderId}>Order #{order.id}</Text>
          <Text style={styles.date}>{dayjs(order.created_at).format('MMM D, YYYY h:mm A')}</Text>
        </View>
        
        <View style={styles.contentContainer}>
          <Text style={styles.productCount}>
            {order.order_items?.length || 0} {order.order_items?.length === 1 ? 'item' : 'items'}
          </Text>
          <Text style={styles.status}>{order.status}</Text>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.total}>Total: ${order.total.toFixed(2)}</Text>
        </View>
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orderId: {
    fontWeight: '600',
    fontSize: 16,
  },
  date: {
    color: 'gray',
    fontSize: 14,
  },
  productCount: {
    color: 'gray',
  },
  status: {
    fontWeight: '500',
    color: Colors.light.tint,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  total: {
    fontSize: 16,
    fontWeight: '500',
  }
});

export default OrderListItem;