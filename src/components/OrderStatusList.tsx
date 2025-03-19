import { View, Text, StyleSheet, Pressable } from 'react-native';
import { OrderStatus, OrderStatusList as Statuses } from '@/types';
import Colors from '@/constants/Colors';

type OrderStatusListProps = {
  status: OrderStatus;
  onStatusChange?: (status: OrderStatus) => void;
};

const OrderStatusList = ({ status, onStatusChange }: OrderStatusListProps) => {
  return (
    <View style={styles.container}>
      {Statuses.map((s) => (
        <Pressable 
          key={s} 
          onPress={() => onStatusChange && onStatusChange(s)}
          style={[
            styles.statusContainer,
            {
              backgroundColor: s === status ? Colors.light.tint : '#f0f0f0',
            },
          ]}
          disabled={!onStatusChange}
        >
          <Text 
            style={[
              styles.statusText,
              { color: s === status ? 'white' : 'gray' }
            ]}
          >
            {s}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  statusContainer: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default OrderStatusList;