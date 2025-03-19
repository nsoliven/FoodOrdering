import { View, Text, StyleSheet } from 'react-native';
import { OrderItem } from '@/types';
import { defaultPizzaImage } from '@/components/ProdcutsListItem';
import Colors from '@/constants/Colors';
import { Tables } from '@/database.types';
import RemoteImage from '@/components/RemoteImage';

type OrderItemListItemProps = {
  item: {products: Tables<'products'>} & Tables<'order_items'>;
};

const OrderItemListItem = ({ item }: OrderItemListItemProps) => {
  return (
    <View style={styles.container}>
      <RemoteImage
        path={item.products.image}
        fallback={defaultPizzaImage}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{item.products.name}</Text>
        <View style={styles.detailsContainer}>
          <Text style={styles.size}>Size: {item.size}</Text>
          <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
        </View>
        <Text style={styles.price}>${(item.products.price * item.quantity).toFixed(2)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 5,
  },
  contentContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontWeight: '500',
    fontSize: 16,
    marginBottom: 5,
  },
  detailsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  size: {
    color: 'gray',
  },
  quantity: {
    color: 'gray',
  },
  price: {
    marginTop: 5,
    fontWeight: 'bold',
    color: Colors.light.tint,
  },
});

export default OrderItemListItem;