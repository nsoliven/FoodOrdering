import { View, Text, StyleSheet } from 'react-native';
import { OrderStatus, OrderStatusList as Statuses } from '@src/types';
import Colors from '@constants/Colors';

type OrderStatusListProps = {
  status: OrderStatus;
};

const OrderStatusList = ({ status }: OrderStatusListProps) => {
  return (
    <View style={styles.container}>
      {Statuses.map((s) => (
        <View 
          key={s} 
          style={[
            styles.statusContainer,
            {
              backgroundColor: s === status ? Colors.light.tint : '#f0f0f0',
            },
          ]}
        >
          <Text 
            style={[
              styles.statusText,
              { color: s === status ? 'white' : 'gray' }
            ]}
          >
            {s}
          </Text>
        </View>
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